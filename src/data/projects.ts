export const projects = [
  {
    slug: "equal-miles",
    title: "Equal Miles — Grab Maps Hackathon",
    year: "2026",
    blurb:
      "Fair meetup finder that ranks venues by real road travel-time fairness instead of naive geographic midpoints.",
    stack: ["Flutter Web", "Dart / Shelf", "MapLibre GL JS", "Grab Maps SDK", "Docker"],
    highlights: [
      "Fairness gap ranking across every friend-to-venue route",
      "Fairest / fastest / closest result badges",
      "Live map pin placement, address resolution, and category comparison",
    ],
    role: "Solo · Hackathon Builder",
    featured: true,
    repo: "https://github.com/PrakharNagpal/Grab_Maps_Hacakthon",
    demo: "https://prakharnagpal.github.io/Grab_Maps_Hacakthon/",
    images: ["/projects/equal-miles/friends.png", "/projects/equal-miles/results.png"],
  },
  {
    slug: "hdb-price-prediction",
    title: "Predictive Modeling for HDB Prices",
    year: "2025",
    blurb:
      "AI pipeline forecasting Singapore HDB resale prices with a LightGBM + histogram gradient-boosting ensemble that beats baselines.",
    stack: ["Python", "LightGBM", "Pandas", "scikit-learn"],
    highlights: [
      "Extensive EDA + feature engineering",
      "Ensemble outperforms baselines on RMSE",
      "Full technical report on architecture & metrics",
    ],
    role: "Solo · ML Engineer",
    featured: true,
  },
  {
    slug: "isd-cia",
    title: "ISD-CIA — In-Store Demonstrator & Cashier-in-App",
    year: "2025",
    blurb:
      "Unified B2B Android app integrating 8 businesses for Bajaj dealers and off-role employees. Streamlined end-to-end loan processing.",
    stack: ["Kotlin", "Jetpack Compose", "MVVM", ".NET APIs"],
    highlights: [
      "8 verticals under one app",
      "Shipped to 5K+ dealers",
      "End-to-end loan workflows",
    ],
    role: "Senior SWE",
    featured: true,
  },
  {
    slug: "bunkerfit",
    title: "Bunkerfit",
    year: "2021",
    blurb:
      "Health & wellness app — training, nutrition, yoga, mindfulness. 100K+ downloads in 200 days.",
    stack: ["Flutter", "Dart", "REST"],
    highlights: ["100K+ downloads", "Cross-platform"],
    role: "SWE Intern",
    featured: false,
  },
  {
    slug: "wittrade",
    title: "Wittrade",
    year: "2021",
    blurb:
      "College e-commerce platform letting students buy, rent, and sell items within a cost-saving community.",
    stack: ["Flutter", "Firebase"],
    highlights: ["Buy / rent / sell", "Student community"],
    role: "Builder",
    featured: false,
  },
  {
    slug: "health-app",
    title: "Health App",
    year: "2020",
    blurb:
      "Java health app: e-prescriptions, medicine notifications, appointment alerts, QR medical records, BMI calculator.",
    stack: ["Java", "Android"],
    highlights: ["QR medical records", "Notifications"],
    role: "Builder",
    featured: false,
  },
] as const;
