export interface Center { [key: string]: any; }

export interface Activity { [key: string]: any; }

export interface Session { [key: string]: any; }

export interface Booking { [key: string]: any; }

export const centers: Center[] = [
  {
    id: "c1",
    name: "Baan Doi Cultural Center",
    nameTh: "บ้านดอย ศูนย์เรียนรู้วัฒนธรรม",
    location: "Mae Rim, Chiang Mai",
    province: "Chiang Mai",
    description:
      "Nestled in the misty mountains of northern Thailand, Baan Doi offers authentic hill tribe crafts, traditional weaving, and northern Thai cooking experiences in a serene village setting.",
    images: ["https://images.unsplash.com/photo-1758778932790-da96c9f06969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjZW50ZXIlMjBsb2NhbCUyMGdhdGhlcmluZyUyMG91dGRvb3J8ZW58MXx8fHwxNzcyNzkyNDU2fDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1758778932790-da96c9f06969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjZW50ZXIlMjBsb2NhbCUyMGdhdGhlcmluZyUyMG91dGRvb3J8ZW58MXx8fHwxNzcyNzkyNDU2fDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1758778932790-da96c9f06969?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjZW50ZXIlMjBsb2NhbCUyMGdhdGhlcmluZyUyMG91dGRvb3J8ZW58MXx8fHwxNzcyNzkyNDU2fDA&ixlib=rb-4.1.0&q=80&w=1080"],
totalActivities: 8,
    tags: ["Crafts", "Cooking", "Culture"],
  },
  {
    id: "c2",
    name: "Isan Roots Learning Center",
    nameTh: "ศูนย์เรียนรู้รากเหง้าอีสาน",
    location: "Khon Kaen",
    province: "Khon Kaen",
    description:
      "Celebrating the rich heritage of northeastern Thailand, Isan Roots specializes in traditional silk weaving, local music (mor lam), and authentic Isan cuisine workshops.",
    images: ["https://images.unsplash.com/photo-1664071186356-4276ad9a022a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdGVtcGxlJTIwbWVkaXRhdGlvbiUyMHlvZ2ElMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcyNzkyNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1664071186356-4276ad9a022a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdGVtcGxlJTIwbWVkaXRhdGlvbiUyMHlvZ2ElMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcyNzkyNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1664071186356-4276ad9a022a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdGVtcGxlJTIwbWVkaXRhdGlvbiUyMHlvZ2ElMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcyNzkyNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080"],
totalActivities: 6,
    tags: ["Weaving", "Music", "Cuisine"],
  },
  {
    id: "c3",
    name: "Koh Samui Eco Wisdom",
    nameTh: "ศูนย์ภูมิปัญญาสิ่งแวดล้อม เกาะสมุย",
    location: "Koh Samui, Surat Thani",
    province: "Surat Thani",
    description:
      "Located on the lush hillsides of Koh Samui, this eco-learning center focuses on tropical herbs, traditional medicine, coconut palm weaving, and sustainable living practices.",
    images: ["https://images.unsplash.com/photo-1587997767711-f0a39f2bdc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYiUyMGdhcmRlbiUyMGdyZWVuJTIwcGxhbnRzfGVufDF8fHx8MTc3Mjc5MjQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1587997767711-f0a39f2bdc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYiUyMGdhcmRlbiUyMGdyZWVuJTIwcGxhbnRzfGVufDF8fHx8MTc3Mjc5MjQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1587997767711-f0a39f2bdc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYiUyMGdhcmRlbiUyMGdyZWVuJTIwcGxhbnRzfGVufDF8fHx8MTc3Mjc5MjQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080"],
totalActivities: 5,
    tags: ["Herbs", "Eco", "Wellness"],
  },
  {
    id: "c4",
    name: "Ayutthaya Heritage Arts",
    nameTh: "ศูนย์ศิลปะมรดกอยุธยา",
    location: "Ayutthaya",
    province: "Ayutthaya",
    description:
      "In the ancient capital of Thailand, this center preserves the royal arts of fruit carving, traditional painting, and classical dance — connecting visitors with Thailand's golden age.",
    images: ["https://images.unsplash.com/photo-1599704622881-97280ae9eaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwZnJ1aXQlMjBjYXJ2aW5nJTIwdHJhZGl0aW9uYWwlMjBhcnR8ZW58MXx8fHwxNzcyNzkyNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1599704622881-97280ae9eaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwZnJ1aXQlMjBjYXJ2aW5nJTIwdHJhZGl0aW9uYWwlMjBhcnR8ZW58MXx8fHwxNzcyNzkyNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1599704622881-97280ae9eaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwZnJ1aXQlMjBjYXJ2aW5nJTIwdHJhZGl0aW9uYWwlMjBhcnR8ZW58MXx8fHwxNzcyNzkyNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"],
totalActivities: 7,
    tags: ["Art", "History", "Dance"],
  },
];

export const activities: Activity[] = [
  {
    id: "a1",
    centerId: "c1",
    title: "Northern Thai Pottery",
    titleTh: "เซรามิกภาคเหนือ",
    category: "Crafts",
    description:
      "Learn the ancient art of wheel-thrown pottery using traditional northern Thai techniques passed down through generations. Shape clay into beautiful vessels while overlooking misty mountains. All skill levels welcome — our master potter will guide you from clay to finished piece.",
    images: ["https://images.unsplash.com/photo-1664787294667-b64f325a751a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjBjcmFmdCUyMHdvcmtzaG9wJTIwcG90dGVyeXxlbnwxfHx8fDE3NzI3OTI0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1664787294667-b64f325a751a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjBjcmFmdCUyMHdvcmtzaG9wJTIwcG90dGVyeXxlbnwxfHx8fDE3NzI3OTI0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1664787294667-b64f325a751a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjBjcmFmdCUyMHdvcmtzaG9wJTIwcG90dGVyeXxlbnwxfHx8fDE3NzI3OTI0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"],
    duration: "3 hours",
    maxParticipants: 12,
    price: 850,
    sessions: [
      { id: "s1a", name: "Morning Masterclass", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a1", date: "2026-03-10", time: "09:00", availableSpots: 8, totalSpots: 12 },
      { id: "s1b", name: "Special Workshop Session", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a1", date: "2026-03-12", time: "13:00", availableSpots: 5, totalSpots: 12 },
      { id: "s1c", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a1", date: "2026-03-15", time: "09:00", availableSpots: 12, totalSpots: 12 },
      { id: "s1d", name: "Special Workshop Session", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a1", date: "2026-03-17", time: "13:00", availableSpots: 3, totalSpots: 12 },
    ],
  },
  {
    id: "a2",
    centerId: "c1",
    title: "Hill Tribe Textile Weaving",
    titleTh: "ทอผ้าชนเผ่า",
    category: "Crafts",
    description:
      "Discover the intricate patterns of hill tribe textiles — from Akha to Karen styles. Use traditional backstrap looms to weave your own fabric strip while learning the symbolic meanings behind each pattern.",
    images: ["https://images.unsplash.com/photo-1737606985741-479bece921b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjB3ZWF2aW5nJTIwdGV4dGlsZSUyMGFydHxlbnwxfHx8fDE3NzI3OTI0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1737606985741-479bece921b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjB3ZWF2aW5nJTIwdGV4dGlsZSUyMGFydHxlbnwxfHx8fDE3NzI3OTI0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1737606985741-479bece921b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjB3ZWF2aW5nJTIwdGV4dGlsZSUyMGFydHxlbnwxfHx8fDE3NzI3OTI0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080"],
    duration: "4 hours",
    maxParticipants: 8,
    price: 1100,
    sessions: [
      { id: "s2a", name: "Morning Masterclass", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a2", date: "2026-03-11", time: "09:00", availableSpots: 6, totalSpots: 8 },
      { id: "s2b", name: "Evening Gathering", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a2", date: "2026-03-14", time: "09:00", availableSpots: 4, totalSpots: 8 },
      { id: "s2c", name: "Evening Gathering", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a2", date: "2026-03-18", time: "09:00", availableSpots: 8, totalSpots: 8 },
    ],
  },
  {
    id: "a3",
    centerId: "c1",
    title: "Northern Thai Cooking Class",
    titleTh: "ทำอาหารล้านนา",
    category: "Cooking",
    description:
      "Master the bold, herby flavors of Lanna cuisine — northern Thailand's distinct culinary tradition. Learn to make Khao Soi, Larb Muang, and Nam Prik Ong from scratch using fresh local ingredients and ancient family recipes.",
    images: ["https://images.unsplash.com/photo-1578366941741-9e517759c620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwY29va2luZyUyMGNsYXNzJTIwZm9vZCUyMHdvcmtzaG9wfGVufDF8fHx8MTc3Mjc5MjQ0N3ww&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1578366941741-9e517759c620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwY29va2luZyUyMGNsYXNzJTIwZm9vZCUyMHdvcmtzaG9wfGVufDF8fHx8MTc3Mjc5MjQ0N3ww&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1578366941741-9e517759c620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwY29va2luZyUyMGNsYXNzJTIwZm9vZCUyMHdvcmtzaG9wfGVufDF8fHx8MTc3Mjc5MjQ0N3ww&ixlib=rb-4.1.0&q=80&w=1080"],
    duration: "5 hours",
    maxParticipants: 10,
    price: 1350,
    sessions: [
      { id: "s3a", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a3", date: "2026-03-09", time: "08:00", availableSpots: 7, totalSpots: 10 },
      { id: "s3b", name: "Morning Masterclass", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a3", date: "2026-03-13", time: "08:00", availableSpots: 10, totalSpots: 10 },
      { id: "s3c", name: "Special Workshop Session", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a3", date: "2026-03-16", time: "08:00", availableSpots: 2, totalSpots: 10 },
    ],
  },
  {
    id: "a4",
    centerId: "c2",
    title: "Traditional Silk Weaving (Mudmee)",
    titleTh: "ทอผ้าไหมมัดหมี่",
    category: "Crafts",
    description:
      "Learn the sacred art of Mudmee silk weaving — a UNESCO-recognized craft of northeastern Thailand. Create your own resist-dyed silk pattern using the ancient tie-dye technique before weaving it on a traditional floor loom.",
    images: ["https://images.unsplash.com/photo-1677142707558-b02ac0690ecb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBiYXNrZXQlMjB3ZWF2aW5nJTIwY3JhZnQlMjBoYW5kbWFkZXxlbnwxfHx8fDE3NzI3OTI0NTl8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1677142707558-b02ac0690ecb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBiYXNrZXQlMjB3ZWF2aW5nJTIwY3JhZnQlMjBoYW5kbWFkZXxlbnwxfHx8fDE3NzI3OTI0NTl8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1677142707558-b02ac0690ecb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW1ib28lMjBiYXNrZXQlMjB3ZWF2aW5nJTIwY3JhZnQlMjBoYW5kbWFkZXxlbnwxfHx8fDE3NzI3OTI0NTl8MA&ixlib=rb-4.1.0&q=80&w=1080"],
    duration: "6 hours",
    maxParticipants: 8,
    price: 1500,
    sessions: [
      { id: "s4a", name: "Evening Gathering", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a4", date: "2026-03-10", time: "08:00", availableSpots: 5, totalSpots: 8 },
      { id: "s4b", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a4", date: "2026-03-14", time: "08:00", availableSpots: 8, totalSpots: 8 },
      { id: "s4c", name: "Special Workshop Session", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a4", date: "2026-03-19", time: "08:00", availableSpots: 6, totalSpots: 8 },
    ],
  },
  {
    id: "a5",
    centerId: "c2",
    title: "Mor Lam Music & Dance",
    titleTh: "ดนตรีและรำหมอลำ",
    category: "Music",
    description:
      "Immerse yourself in the soulful world of Mor Lam — the heartbeat of Isan culture. Learn basic khaen (bamboo mouth organ) playing and the flowing gestures of traditional Isan dance in a fun, welcoming group setting.",
    images: ["https://images.unsplash.com/photo-1758346974564-07a164871e7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjBtdXNpYyUyMGluc3RydW1lbnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NzI3OTI0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1758346974564-07a164871e7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjBtdXNpYyUyMGluc3RydW1lbnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NzI3OTI0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1758346974564-07a164871e7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdHJhZGl0aW9uYWwlMjBtdXNpYyUyMGluc3RydW1lbnQlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NzI3OTI0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080"],
    duration: "3 hours",
    maxParticipants: 15,
    price: 750,
    sessions: [
      { id: "s5a", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a5", date: "2026-03-11", time: "16:00", availableSpots: 12, totalSpots: 15 },
      { id: "s5b", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a5", date: "2026-03-15", time: "16:00", availableSpots: 8, totalSpots: 15 },
      { id: "s5c", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a5", date: "2026-03-20", time: "16:00", availableSpots: 15, totalSpots: 15 },
    ],
  },
  {
    id: "a6",
    centerId: "c3",
    title: "Thai Herbal Medicine Workshop",
    titleTh: "สมุนไพรไทย",
    category: "Wellness",
    description:
      "Walk through a living herb garden and learn how Thai traditional medicine uses local plants for healing. Make your own herbal compress ball (luk pra kob), herbal steam blend, and take-home herbal remedies.",
    images: ["https://images.unsplash.com/photo-1587997767711-f0a39f2bdc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYiUyMGdhcmRlbiUyMGdyZWVuJTIwcGxhbnRzfGVufDF8fHx8MTc3Mjc5MjQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1587997767711-f0a39f2bdc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYiUyMGdhcmRlbiUyMGdyZWVuJTIwcGxhbnRzfGVufDF8fHx8MTc3Mjc5MjQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1587997767711-f0a39f2bdc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYiUyMGdhcmRlbiUyMGdyZWVuJTIwcGxhbnRzfGVufDF8fHx8MTc3Mjc5MjQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080"],
    duration: "4 hours",
    maxParticipants: 10,
    price: 980,
    sessions: [
      { id: "s6a", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a6", date: "2026-03-10", time: "09:00", availableSpots: 9, totalSpots: 10 },
      { id: "s6b", name: "Evening Gathering", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a6", date: "2026-03-13", time: "09:00", availableSpots: 6, totalSpots: 10 },
      { id: "s6c", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a6", date: "2026-03-17", time: "09:00", availableSpots: 10, totalSpots: 10 },
    ],
  },
  {
    id: "a7",
    centerId: "c4",
    title: "Royal Thai Fruit Carving",
    titleTh: "แกะสลักผัก-ผลไม้แบบราชสำนัก",
    category: "Cooking",
    description:
      "Master the elegant art of Thai fruit and vegetable carving — a tradition originating in the royal palace. Learn to transform simple produce into intricate flowers, birds, and geometric patterns for stunning garnishes and table decorations.",
    images: ["https://images.unsplash.com/photo-1599704622881-97280ae9eaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwZnJ1aXQlMjBjYXJ2aW5nJTIwdHJhZGl0aW9uYWwlMjBhcnR8ZW58MXx8fHwxNzcyNzkyNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1599704622881-97280ae9eaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwZnJ1aXQlMjBjYXJ2aW5nJTIwdHJhZGl0aW9uYWwlMjBhcnR8ZW58MXx8fHwxNzcyNzkyNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1599704622881-97280ae9eaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwZnJ1aXQlMjBjYXJ2aW5nJTIwdHJhZGl0aW9uYWwlMjBhcnR8ZW58MXx8fHwxNzcyNzkyNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"],
    duration: "3 hours",
    maxParticipants: 12,
    price: 900,
    sessions: [
      { id: "s7a", name: "Morning Masterclass", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a7", date: "2026-03-09", time: "10:00", availableSpots: 10, totalSpots: 12 },
      { id: "s7b", name: "Evening Gathering", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a7", date: "2026-03-12", time: "10:00", availableSpots: 7, totalSpots: 12 },
      { id: "s7c", name: "Morning Masterclass", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a7", date: "2026-03-16", time: "10:00", availableSpots: 12, totalSpots: 12 },
    ],
  },
  {
    id: "a8",
    centerId: "c4",
    title: "Classical Thai Dance (Khon)",
    titleTh: "โขน-รำไทยคลาสสิก",
    category: "Arts",
    description:
      "Experience the breathtaking world of Khon — Thailand's UNESCO-recognized masked dance drama. Learn foundational hand gestures (natasin), postures, and movements from classical Ramakien scenes under expert guidance.",
    images: ["https://images.unsplash.com/photo-1664071186356-4276ad9a022a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdGVtcGxlJTIwbWVkaXRhdGlvbiUyMHlvZ2ElMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcyNzkyNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1664071186356-4276ad9a022a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdGVtcGxlJTIwbWVkaXRhdGlvbiUyMHlvZ2ElMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcyNzkyNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080", "https://images.unsplash.com/photo-1664071186356-4276ad9a022a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpJTIwdGVtcGxlJTIwbWVkaXRhdGlvbiUyMHlvZ2ElMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcyNzkyNDUxfDA&ixlib=rb-4.1.0&q=80&w=1080"],
    duration: "2.5 hours",
    maxParticipants: 10,
    price: 1200,
    sessions: [
      { id: "s8a", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a8", date: "2026-03-11", time: "14:00", availableSpots: 8, totalSpots: 10 },
      { id: "s8b", name: "Afternoon Practice", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a8", date: "2026-03-15", time: "14:00", availableSpots: 5, totalSpots: 10 },
      { id: "s8c", name: "Morning Masterclass", description: "Join us for a wonderful experience learning the fundamentals and advancing your skills in a practical environment.", activityId: "a8", date: "2026-03-18", time: "14:00", availableSpots: 10, totalSpots: 10 },
    ],
  },
];

export const categories = [
  "All",
  "Crafts",
  "Cooking",
  "Arts",
  "Wellness",
  "Cooking",
];

export const provinces = [
  "All Provinces",
  "Chiang Mai",
  "Khon Kaen",
  "Surat Thani",
  "Ayutthaya",
];



