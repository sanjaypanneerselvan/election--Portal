import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, query, where, writeBatch, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const CANDIDATES = [
    { name: 'M. K. Stalin', party: 'DMK', constituency: 'Kolathur', description: 'Current Chief Minister of Tamil Nadu and President of DMK. Known for his "Vidiyal" campaign.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/MK_Stalin.jpg' },
    { name: 'Edappadi K. Palaniswami', party: 'AIADMK', constituency: 'Edappadi', description: 'Leader of Opposition and General Secretary of AIADMK. Focusing on rural development.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Edappadi_K._Palaniswami.jpg' },
    { name: 'Vijay', party: 'TVK', constituency: 'Madurai Central', description: 'Megastar of Tamil Cinema and founder of TVK. Aims for "Transparent Governance".', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Vijay_at_the_Leo_Success_Meet.jpg' },
    { name: 'K. Annamalai', party: 'BJP', constituency: 'Coimbatore South', description: 'Former IPS officer and State President of BJP TN. Leading the "En Mann En Makkal" yatra.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/K._Annamalai_IPS.jpg' },
    { name: 'Seeman', party: 'NTK', constituency: 'Virugambakkam', description: 'Founder of NTK. Advocating for ethnic Tamil nationalism and environmental protection.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Seeman_2024.jpg' }
];

const PARTIES = [
    { 
        name: 'DMK', 
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/DMK_logo.svg/200px-DMK_logo.svg.png', 
        description: 'Dravida Munnetra Kazhagam - The Rising Sun.',
        leaderName: 'M. K. Stalin',
        leaderImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/MK_Stalin.jpg'
    },
    { 
        name: 'AIADMK', 
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/AIADMK_logo.svg/200px-AIADMK_logo.svg.png', 
        description: 'All India Anna Dravida Munnetra Kazhagam - Two Leaves.',
        leaderName: 'Edappadi K. Palaniswami',
        leaderImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Edappadi_K._Palaniswami.jpg'
    },
    { 
        name: 'TVK', 
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Tamilaga_Vettri_Kazhagam_logo.png/250px-Tamilaga_Vettri_Kazhagam_logo.png', 
        description: 'Tamilaga Vettri Kazhagam - Foundation of Victory.',
        leaderName: 'Vijay',
        leaderImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Vijay_at_the_Leo_Success_Meet.jpg'
    },
    { 
        name: 'BJP', 
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/200px-Bharatiya_Janata_Party_logo.svg.png', 
        description: 'Bharatiya Janata Party - The Lotus.',
        leaderName: 'K. Annamalai',
        leaderImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/K._Annamalai_IPS.jpg'
    },
    { 
        name: 'NTK', 
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Naam_Tamilar_Katchi_Logo.png/200px-Naam_Tamilar_Katchi_Logo.png', 
        description: 'Naam Tamilar Katchi - The Gushing Tiger.',
        leaderName: 'Seeman',
        leaderImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Seeman_2024.jpg'
    },
    { 
        name: 'MNM', 
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/MNM_Logo.svg/200px-MNM_Logo.svg.png', 
        description: 'Makkal Needhi Maiam - Torch Light.',
        leaderName: 'Kamal Haasan',
        leaderImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Kamal_Haasan_2021.jpg'
    },
    { 
        name: 'AMMK', 
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/AMMK_Flag.png', 
        description: 'Amma Makkal Munnettra Kazagam.',
        leaderName: 'T. T. V. Dhinakaran',
        leaderImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/TTV_Dhinakaran.jpg'
    }
];

export const useSeeder = () => {
    const seed = async (force = false) => {
        const cSnap = await getDocs(collection(db, 'candidates'));
        const pSnap = await getDocs(collection(db, 'parties'));

        if (force || cSnap.empty || pSnap.empty) {
            console.log('Database empty/reset requested. Syncing from local CSV...');
            const count = await syncMasterData();
            
            if (count === 0) {
                console.log('CSV sync returned 0. Seeding minimal fallback data...');
                const batch = writeBatch(db);
                if (force) {
                    const docs = [...cSnap.docs, ...pSnap.docs];
                    docs.forEach(d => batch.delete(d.ref));
                }
                CANDIDATES.forEach(c => batch.set(doc(collection(db, 'candidates')), c));
                
                // Map parties correctly with all metadata
                PARTIES.forEach(p => {
                    batch.set(doc(collection(db, 'parties')), {
                        name: p.name,
                        logoUrl: p.logoUrl,
                        description: p.description,
                        leaderName: p.leaderName,
                        leaderImageUrl: p.leaderImageUrl
                    });
                });
                await batch.commit();
            }
            console.log('Electoral data synchronized!');
        }
    };

    const syncMasterData = async () => {
        try {
            console.log('Fetching local master electoral data...');
            const response = await fetch('/data.csv');
            const text = await response.text();
            
            // Simple CSV Parser
            const lines = text.split('\n');
            const headers = lines[0].split(',');
            const data = lines.slice(1).map(line => {
                const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Handle quoted commas
                const obj = {};
                headers.forEach((header, i) => {
                    obj[header.trim()] = values[i]?.trim().replace(/^"|"$/g, '');
                });
                return obj;
            }).filter(d => d['Candidate Name']);

            const batch = writeBatch(db);
            
            // Clear existing candidates
            const cSnap = await getDocs(collection(db, 'candidates'));
            cSnap.docs.forEach(d => batch.delete(d.ref));

            // Map and Seed
            data.forEach(d => {
                const candidate = {
                    name: d['Candidate Name'],
                    party: d['Party'],
                    constituency: d['Constituency'],
                    constId: d['constId'],
                    imageUrl: d['image_url'],
                    gender: d['Gender'],
                    age: d['Age'],
                    alliance: d['Alliance'],
                    front: d['Alliance_Front'],
                    affidavitUrl: d['afidavit_url'],
                    district: d['District'],
                    partyColor: d['Color'],
                    description: `Official candidate representing ${d['Party']} in the ${d['Constituency']} constituency.`
                };
                batch.set(doc(collection(db, 'candidates')), candidate);
            });

            await batch.commit();
            console.log(`Synced ${data.length} candidates successfully!`);
            return data.length;
        } catch (err) {
            console.error('Sync failed:', err);
            return 0;
        }
    };

    const registerAdmin = async () => {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, 'admin@election.com', 'admin123');
            await setDoc(doc(db, 'users', userCred.user.uid), {
                name: 'System Admin',
                email: 'admin@election.com',
                role: 'admin'
            });
            return true;
        } catch (err) {
            console.log('Admin registration note:', err.message);
            return false;
        }
    };

    return { seed, registerAdmin, syncMasterData };
};
