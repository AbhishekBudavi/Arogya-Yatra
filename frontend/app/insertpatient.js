const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const patients = await prisma.patient.createMany({
        data: [
            {
                address: 'Hno 123 Patilgalli Alarwad',
                allergies: 'Fever',
                city: 'Belagavi',
                height: 123,
                pincode: 590010,
                state: 'Karnataka',
                weight: 85,
                gender: 'Male',
                blood_group: 'O+',
                chronic_illness: 'Peanut',
            },
            {
                address: 'Hno 456 MG Road Hubli',
                allergies: 'Cold',
                city: 'Hubli',
                height: 150,
                pincode: 580020,
                state: 'Karnataka',
                weight: 70,
                gender: 'Female',
                blood_group: 'A+',
                chronic_illness: 'Asthma',
            },
        ],
    });

    console.log('Inserted Patients:', patients);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
