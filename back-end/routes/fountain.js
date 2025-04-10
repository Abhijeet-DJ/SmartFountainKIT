import express from 'express';
import Fountain from '../models/Fountains.js';
import moment from 'moment';

const router = express.Router();

// ✅ GET Route - Read Data and Save/Update if Query is Present
router.get('/data', async (req, res) => {
    const { fountainId, PH, TDS, Turbidity, waterTemperature, waterLevel, R, G, B, pumpStatus, RGBStatus } = req.query;

    if (fountainId) {
        try {
            // Check if the fountain already exists
            const existingFountain = await Fountain.findOne({ fountainId });

            if (existingFountain) {
                // ✅ Update the existing entry
                existingFountain.PH = PH || existingFountain.PH;
                existingFountain.TDS = TDS || existingFountain.TDS;
                existingFountain.Turbidity = Turbidity || existingFountain.Turbidity;
                existingFountain.waterTemperature = waterTemperature || existingFountain.waterTemperature;
                existingFountain.waterLevel = waterLevel || existingFountain.waterLevel;
                existingFountain.RGB = { 
                    R: R !== undefined ? R : existingFountain.RGB.R,
                    G: G !== undefined ? G : existingFountain.RGB.G,
                    B: B !== undefined ? B : existingFountain.RGB.B 
                };                
                existingFountain.pumpStatus = pumpStatus !== undefined ? pumpStatus : existingFountain.pumpStatus;
                existingFountain.RGBStatus = RGBStatus !== undefined ? RGBStatus : existingFountain.RGBStatus;

                await existingFountain.save();
                return res.status(200).json({ message: 'Data updated successfully!', data: existingFountain });
            } else {
                // ✅ Create new entry if no existing record
                const newFountain = new Fountain({
                    fountainId,
                    PH,
                    TDS,
                    Turbidity,
                    waterTemperature,
                    waterLevel,
                    RGB: { 
                        R: R !== undefined ? R : 0, 
                        G: G !== undefined ? G : 0, 
                        B: B !== undefined ? B : 0 
                    }, // ✅ Ensure default values for RGB
                    pumpStatus,
                    RGBStatus
                });
                

                await newFountain.save();
                return res.status(201).json({ message: 'New data saved successfully!', data: newFountain });
            }
        } catch (err) {
            return res.status(500).json({ error: 'Failed to save/update data', details: err.message });
        }
    }

    // ✅ Regular GET Data Logic
    try {
        const fountains = fountainId
            ? await Fountain.find({ fountainId })
            : await Fountain.find();
        res.status(200).json(fountains);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data', details: err.message });
    }
});

// PUT route to update RGB values
// router.put('/data/:id', async (req, res) => {
//     // console.log('✅ Received PUT request:', req.body); // Confirm incoming data

//     const { RGB } = req.body;

//     if (!RGB) {
//         console.log('❌ No RGB data found in request');
//         return res.status(400).json({ message: 'RGB data is required.' });
//     }

//     try {
//         const updatedFountain = await Fountain.findOneAndUpdate(
//             { fountainId: req.params.id }, 
//             { $set: { RGB : {
//                 R: RGB.r,
//                 G: RGB.g,
//                 B: RGB.b
//             } } },   // Ensure this update logic matches your schema
//             { new: true },
//             { upsert : true }
//         );

//         if (!updatedFountain) {
//             console.log('❌ Fountain not found');
//             return res.status(404).json({ message: 'Fountain not found' });
//         }

//         // console.log('✅ Updated Fountain Data:', updatedFountain);  // Verify saved data
//         res.status(200).json(updatedFountain);
//     } catch (error) {
//         console.error('❌ Error updating RGB values:', error);
//         res.status(500).json({ message: 'Server error while updating RGB values' });
//     }
// });


router.put('/data/:id', async (req, res) => {
    const { RGB, RGBStatus, pumpStatus } = req.body;

    try {
        const updateFields = {};

        // Create or overwrite RGB field safely
        if (RGB) {
            updateFields.RGB = {
                R: RGB.r ?? 0,
                G: RGB.g ?? 0,
                B: RGB.b ?? 0
            };
        }

        if (RGBStatus !== undefined) {
            updateFields.RGBStatus = RGBStatus;
        }

        if (pumpStatus !== undefined) {
            updateFields.pumpStatus = pumpStatus;
        }

        const updatedFountain = await Fountain.findOneAndUpdate(
            { fountainId: req.params.id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedFountain) {
            console.log('❌ Fountain not found');
            return res.status(404).json({ message: 'Fountain not found' });
        }

        console.log('✅ Updated Fountain Data:', updatedFountain);
        res.status(200).json(updatedFountain);
    } catch (error) {
        console.error('❌ Error updating values:', error);
        res.status(500).json({ message: 'Server error while updating values' });
    }
});


router.get('/fountains/:id/weekly', async (req, res) => {
    try {
        const fountainId = req.params.id;
        const oneWeekAgo = moment().subtract(6, 'days').startOf('day').toDate();

        const data = await Fountain.aggregate([
            {
                $match: {
                    fountainId,
                    timestamp: { $gte: oneWeekAgo }
                }
            },
            {
                $addFields: {
                    day: { $dayOfWeek: "$timestamp" } // 1 (Sun) to 7 (Sat)
                }
            },
            {
                $group: {
                    _id: "$day",
                    avgTemperature: { $avg: "$waterTemperature" },
                    avgTurbidity: { $avg: "$Turbidity" },
                }
            },
            {
                $project: {
                    _id: 0,
                    day: "$_id",
                    Temperature: { $round: ["$avgTemperature", 2] },
                    Turbidity: { $round: ["$avgTurbidity", 2] },
                }
            }
        ]);

        // Convert MongoDB day index to weekday names
        const dayMap = {
            1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed",
            5: "Thu", 6: "Fri", 7: "Sat"
        };

        const weeklyData = {};
        data.forEach(entry => {
            const dayName = dayMap[entry.day];
            weeklyData[dayName] = {
                Temperature: entry.Temperature,
                Turbidity: entry.Turbidity
            };
        });

        res.json(weeklyData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;
