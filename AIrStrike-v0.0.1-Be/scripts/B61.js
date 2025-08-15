import { world, system, BlockPermutation } from "@minecraft/server";

const radius = 90;
const height = 58;
const totalTicks = 40; // 段階分割数（40ティックで全破壊）

function getDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function normalizeDistance(dist, maxDist) {
  return Math.min(100, Math.max(1, Math.floor((dist / maxDist) * 100)));
}

function getBreakChance(normDist) {
  if (normDist >= 58 && normDist <= 65) return 0.8;
  if (normDist >= 66 && normDist <= 75) return 0.75;
  if (normDist >= 76 && normDist <= 82) return 0.5;
  if (normDist >= 83 && normDist <= 95) return 0.4;
  if (normDist >= 96 && normDist <= 100) return 0.35;
  return 1;
}

function getCrushedSphere(center, radius, height) {
  const blocks = [];
  const maxDist = Math.sqrt(radius * radius + height * height);

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const xzDist = Math.sqrt(dx * dx + dz * dz);
      if (xzDist > radius) continue;

      const yLimit = Math.floor((1 - xzDist / radius) * height);
      for (let dy = -yLimit; dy <= yLimit; dy++) {
        const pos = {
          x: Math.floor(center.x + dx),
          y: Math.floor(center.y + dy),
          z: Math.floor(center.z + dz),
        };

        const dist = getDistance(center, pos);
        const normDist = normalizeDistance(dist, maxDist);
        blocks.push({ pos, normDist });
      }
    }
  }

  return blocks;
}

function breakBlock(pos, dim, normDist) {
  const block = dim.getBlock(pos);
  if (!block) return;

  const id = block.typeId;
  if (
    id === "minecraft:bedrock" ||
    id === "minecraft:barrier" ||
    id === "minecraft:command_block" ||
    id === "minecraft:repeating_command_block" ||
    id === "minecraft:chain_command_block" ||
    id === "minecraft:structure_block" ||
    id === "minecraft:jigsaw" ||
    id === "minecraft:deny" ||
    id === "minecraft:allow"
  ) return;

  if (Math.random() <= getBreakChance(normDist)) {
    block.setPermutation(BlockPermutation.resolve("minecraft:air"));
  }
}

system.runInterval(() => {
  const dim = world.getDimension("minecraft:overworld");

  for (const entity of dim.getEntities({ type: "ais:nuke" })) {
    const center = entity.location;
    const blocks = getCrushedSphere(center, radius, height);

    // normDist によってブロックを 40 段階に分割
	const stages = {};
    for (let i = 1; i <= totalTicks; i++) stages[i] = [];

    for (const b of blocks) {
      const stage = Math.min(
        totalTicks,
        Math.floor((b.normDist / 100) * totalTicks) + 1
      );
      stages[stage].push(b);
    }

    // 1ティックずつ順番に破壊
    for (let tick = 1; tick <= totalTicks; tick++) {
      system.runTimeout(() => {
        for (const b of stages[tick]) {
          breakBlock(b.pos, dim, b.normDist);
        }
        if (tick === totalTicks) entity.kill();
      }, tick);
    }
  }
}, 5);