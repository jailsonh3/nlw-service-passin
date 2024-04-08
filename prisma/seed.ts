import { prisma } from "../src/database/prisma"

async function seed() {
  await prisma.event.create({
   data: {
    id: '2da73b4e-0f87-4463-8ece-b48a26c5f6bc',
    title: 'Inite Summit',
    slug: 'unite-summit',
    details: 'Um evento p/ devs apaixonador por código!',
    maximumAttendees: 120,
   }
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})