import { prisma } from "./src/lib/db";

async function main() {
  console.log("Searching for diamond...");
  const diamond = await prisma.diamond.findFirst({
    where: {
      OR: [
        { roughId: "TN013367" },
        { diamonddnaId: "TN013367" },
      ]
    },
    include: {
      stage1: true,
      stage2: true,
      stage3: true,
      stage4: true,
      stage5: true,
      stage6: true,
      stage7: true,
      stage8: true,
      stage9: true,
      stage10: true,
      stage11: true,
      stage12: true,
      stage13: true,
      stage14: true,
    }
  });

  console.log("RESULT:", JSON.stringify(diamond, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
