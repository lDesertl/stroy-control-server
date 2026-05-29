import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const getSeedDate = (offsetDays = 0) => {
	const d = new Date();
	d.setUTCHours(12, 0, 0, 0);
	d.setUTCDate(d.getUTCDate() - offsetDays);
	return d;
};

const entries = [
	{
		date: getSeedDate(),
		workType: "Монтаж опалубки",
		unit: "м²",
		volume: 45.5,
		performerName: "Иванов И.И.",
	},
	{
		date: getSeedDate(1),
		workType: "Заливка бетона",
		unit: "м³",
		volume: 120,
		performerName: "Петров П.П.",
	},
	{
		date: getSeedDate(2),
		workType: "Армирование конструкций",
		unit: "т",
		volume: 3.45,
		performerName: "Сидоров А.В.",
	},
	{
		date: getSeedDate(3),
		workType: "Прокладка кабеля",
		unit: "м",
		volume: 250,
		performerName: "Козлов М.Д.",
	},
	{
		date: getSeedDate(4),
		workType: "Монтаж окон",
		unit: "шт.",
		volume: 18,
		performerName: "Кузнецов В.С.",
	},
];

const main = async () => {
	const existing = await prisma.workLogEntry.count();
	if (existing > 0) {
		console.log("Seed пропущен: в журнале уже есть записи");
		return;
	}

	for (const item of entries) {
		await prisma.workLogEntry.create({
			data: {
				date: item.date,
				volume: item.volume,
				performerName: item.performerName,
				workType: {
					connectOrCreate: {
						where: { name: item.workType },
						create: { name: item.workType },
					},
				},
				unit: {
					connectOrCreate: {
						where: { name: item.unit },
						create: { name: item.unit },
					},
				},
			},
		});
	}

	console.log("База StroyControl успешно засеяна");
};

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});
