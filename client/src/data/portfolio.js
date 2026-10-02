// ============================================
// Portfolio Data — Single Source of Truth
// ============================================
// Sheshank's Personal Developer Portfolio
// ============================================

const portfolio = {
  // ---- Personal Info ----
  personal: {
    name: 'Sheshank',
    fullName: 'Sheshank Gahlawat',
    firstName: 'Sheshank',
    role: 'Full-Stack Developer & Problem Solver',
    college: 'Chandigarh Group of Colleges, Landran',
    degree: 'B.Tech in Computer Science & Engineering',
    graduationYear: '2028',
    cgpa: '6.56 CGPA',
    tagline: 'I build scalable, purpose-driven digital products with modern web technologies.',
    location: 'Hisar, Haryana, India',
    email: 'sheshankg01@gmail.com',
    phone: '+91 81681 70778',
    phoneRaw: '+91816817077',
    photo: '/sheshank.jpg',
    availability: 'Open to internships & engineering roles',
    isAvailable: true,
  },

  // ---- Social Links ----
  social: {
    github: 'https://github.com/Sheshank110',
    linkedin: 'https://www.linkedin.com/in/sheshank-gahlawat-245934348/',
    email: 'mailto:sheshankg01@gmail.com',
  },

  // ---- SEO ----
  seo: {
    title: 'Sheshank — Full-Stack Developer & Computer Science Student',
    description: 'Personal portfolio of Sheshank — B.Tech Computer Science student at CGC Landran. Full-stack developer building scalable web applications with MERN stack, JavaScript, and AWS.',
    url: 'https://github.com/Sheshank110',
  },

  // ---- Hero Section ----
  hero: {
    labels: ['FULL-STACK DEVELOPER', 'CSE @ CGC LANDRAN', 'AWS CERTIFIED'],
    heading: 'I build digital products\nthat solve real problems',
    description: 'B.Tech Computer Science student (2024–2028) at Chandigarh Group of Colleges, Landran. Passionate about Data Structures & Algorithms, Object-Oriented Programming, and building scalable full-stack web applications with JavaScript, React.js, and Node.js.',
    cta: {
      primary: { text: 'Explore Projects', href: '#projects' },
      secondary: { text: "Let's Connect", href: '#contact' },
    },
  },

  // ---- About Section ----
  about: {
    statement: "I don't just write code — I build reliable systems that solve real-world problems.",
    description: [
      "I am a Computer Science undergraduate (Class of 2028) at Chandigarh Group of Colleges, Landran, with strong foundations in Data Structures & Algorithms, Object-Oriented Programming, and Database Management Systems.",
      "My primary focus is developing responsive, scalable web applications using JavaScript, React.js, Node.js, and Express. From engineering 'Life Card' — an emergency medical response platform with QR-code access — to creating AR-based cultural heritage systems for the Smart India Hackathon, I love bringing ideas to life through thoughtful code and clean architecture.",
      "I am AWS-certified in Cloud Computing and Generative AI Foundations. Beyond the screen, I maintain a strong commitment to continuous learning, system design, fitness, and badminton.",
    ],
    education: [
      {
        id: 1,
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'Chandigarh Group of Colleges, Landran',
        period: '2024 — 2028',
        score: '6.56 CGPA (Expected May 2028)',
      },
      {
        id: 2,
        degree: 'Senior Secondary (CBSE Class XII)',
        institution: 'Sunrise Modern School, Sarsod, Hisar',
        period: '2023 — 2024',
        score: '70% Marks',
      },
      {
        id: 3,
        degree: 'Matriculation (CBSE Class X)',
        institution: 'RPS School, Hansi, Haryana',
        period: '2021 — 2022',
        score: '80% Marks',
      },
    ],
    currentlyExploring: [
      'Full-Stack MERN Architecture',
      'System Design & Scalability',
      'AWS Cloud Infrastructure',
      'Generative AI Foundations',
      'Data Structures & Algorithms',
    ],
    personalDetails: {
      motherName: 'Mrs. Krishana Devi',
      fatherName: 'Mr. Sandeep Kumar',
      dob: '10.12.2005',
      languages: ['English', 'Hindi'],
      interests: ['Fitness', 'System Design', 'Badminton', 'Movies'],
    },
  },

  // ---- Skills ----
  skills: {
    Languages: ['JavaScript (ES6+)', 'C', 'C++', 'HTML5', 'CSS3', 'SQL'],
    Frontend: ['React.js', 'Tailwind CSS', 'Responsive UI', 'Framer Motion', 'REST API Integration'],
    Backend: ['Node.js', 'Express.js', 'RESTful APIs', 'JSON Processing', 'Middleware'],
    Database: ['MongoDB', 'MySQL', 'Mongoose ODM'],
    'Core CS': ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Operating Systems'],
    'Cloud & Tools': ['AWS Cloud Computing', 'AWS GenAI Foundations', 'Git & GitHub', 'Android Studio', 'VS Code'],
  },

  // ---- Projects ----
  projects: [
    {
      id: 1,
      title: 'Life Card',
      subtitle: 'QR-Enabled Emergency Medical Response System',
      description: 'A life-saving emergency medical record platform designed for first responders. Scanning a secure physical QR card provides instant access to critical patient medical history, blood groups, allergies, and emergency contacts during golden-hour interventions.',
      problem: 'During acute medical emergencies, first responders often lack quick access to patient medical histories, leading to preventable treatment delays and adverse drug reactions.',
      solution: 'Engineered a secure QR-code scanning workflow connected to a responsive MERN web dashboard that instantly displays critical triage data and vital medical profiles in milliseconds.',
      technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'QR Code Engine', 'Tailwind CSS'],
      features: [
        'Instant QR code scan for golden-hour medical triage',
        'Secure patient profile and critical allergy management',
        'Mobile-first responsive dashboard for paramedic access',
        'High-reliability MongoDB backend persistence',
      ],
      image: '/projects/lifecard.jpg',
      github: 'https://github.com/Sheshank110',
      live: '',
      team: 'Team of 2',
      duration: '7 Days',
      featured: true,
    },
    {
      id: 2,
      title: 'FitFlow',
      subtitle: 'Dynamic News Discovery & Article Aggregation Engine',
      description: 'A responsive news and content reader application that fetches trending articles via REST APIs. Features dynamic keyword search, multi-category filtering, and asynchronous JSON data streaming.',
      problem: 'Online news reading is often cluttered with distracting ads, heavy asset payloads, and slow search capabilities.',
      solution: 'Built a lightweight, distraction-free reading experience with client-side category filtering, topic search, and asynchronous API data fetching.',
      technologies: ['JavaScript', 'Android Studio', 'REST API', 'JSON Stream', 'CSS3'],
      features: [
        'Asynchronous JSON API data fetching & article caching',
        'Instant keyword search and topic-based filtering',
        'Clean, mobile-optimized article viewer',
      ],
      image: '/projects/fitflow.jpg',
      github: 'https://github.com/Sheshank110',
      live: '',
      team: 'Individual Project',
      duration: '5 Days',
      featured: false,
    },
    {
      id: 3,
      title: 'AR Cultural Heritage Preservation',
      subtitle: 'Smart India Hackathon (SIH) National Innovation Project',
      description: 'An interactive Augmented Reality and 3D web platform engineered to digitally preserve, archive, and showcase cultural heritage monuments and historical artifacts.',
      problem: 'Physical deterioration and static museum exhibits limit accessibility and interactive engagement with historical Indian monuments.',
      solution: 'Developed an immersive platform combining 3D monument reconstruction, interactive spatial annotations, and AR camera exploration.',
      technologies: ['Augmented Reality (AR)', 'JavaScript', '3D Web', 'HTML5', 'CSS3'],
      features: [
        'Interactive 3D model viewport with 360° inspection',
        'Spatial AR camera mode for virtual walkthroughs',
        'Curated historical timelines and architectural annotations',
      ],
      image: '/projects/sih-heritage.jpg',
      github: 'https://github.com/Sheshank110',
      live: '',
      team: 'SIH Hackathon Team',
      featured: false,
    },
    {
      id: 4,
      title: 'Timeless Trends',
      subtitle: 'Premium Fashion E-Commerce Platform',
      description: 'A production-ready, full-stack fashion e-commerce platform featuring AI-powered style recommendations, multi-step checkout with Razorpay payments, admin analytics dashboard, and a complete product management system.',
      problem: 'Online fashion shopping often lacks personalized styling guidance, seamless payment experiences, and robust inventory management — leading to poor conversion and customer satisfaction.',
      solution: 'Engineered a comprehensive e-commerce platform with AI Stylist recommendations, visual style customizer, Razorpay-integrated checkout (UPI, Cards, COD), real-time order tracking, and a full admin dashboard with analytics, inventory alerts, and review moderation.',
      technologies: ['React 19', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay', 'Cloudinary', 'Redux Toolkit', 'Tailwind CSS'],
      features: [
        'AI-powered fashion stylist and visual outfit customizer',
        'Multi-step checkout with Razorpay (UPI, Cards, Net Banking, COD)',
        'Admin dashboard with sales analytics, inventory & coupon management',
        'Smart search with debounce, filters, wishlist & review system',
      ],
      image: '/projects/timeless-trends.jpg',
      github: 'https://github.com/Sheshank110/Timeless-trends',
      live: '',
      team: 'Individual Project',
      duration: 'Ongoing',
      featured: false,
    },
  ],

  // ---- Journey / Experience ----
  experience: [
    {
      id: 1,
      type: 'education',
      title: 'B.Tech in Computer Science & Engineering',
      organization: 'Chandigarh Group of Colleges, Landran',
      date: '2024 — 2028',
      description: 'Pursuing undergraduate degree in Computer Science. Focus on Data Structures & Algorithms, Object-Oriented Programming, and Full-Stack Web Development. Academic Score: 6.56 CGPA.',
    },
    {
      id: 2,
      type: 'milestone',
      title: 'National Conference Poster Presentation Awards (ICCS & ICCMST)',
      organization: 'ICCS 2025 & ICCMST 2025 Conferences',
      date: '2025',
      description: 'Secured 2nd Prize in the ICCS 2025 Poster Presentation and 3rd Prize in the ICCMST 2025 Poster Presentation for technical research exhibits.',
    },
    {
      id: 3,
      type: 'milestone',
      title: 'Smart India Hackathon (SIH) & Innovation Canvas Exhibit',
      organization: 'SIH & Innovation Canvas Exhibit 2k24',
      date: '2024',
      description: 'Participated in Smart India Hackathon (SIH) with an AR-Based Cultural Heritage Preservation Platform. Also awarded 3rd Prize in the Innovation Canvas Exhibit 2k24.',
    },
    {
      id: 4,
      type: 'project',
      title: 'Full Stack MERN Development Training & Life Card Build',
      organization: 'Intensive Training & Project Development',
      date: '2024',
      description: 'Completed comprehensive 3-week Full Stack MERN development training; designed and built Life Card (QR emergency medical response) and FitFlow applications.',
    },
    {
      id: 5,
      type: 'education',
      title: 'Intermediate (CBSE Senior Secondary — Class XII)',
      organization: 'Sunrise Modern School, Sarsod, Hisar, Haryana',
      date: '2023 — 2024',
      description: 'Completed senior secondary education with 70% aggregate in the Science stream.',
    },
    {
      id: 6,
      type: 'education',
      title: 'Matriculation (CBSE Secondary — Class X)',
      organization: 'RPS School, Hansi, Haryana',
      date: '2021 — 2022',
      description: 'Completed Class X with 80% aggregate, demonstrating strong foundation in Mathematics and Science.',
    },
  ],

  // ---- Achievements ----
  achievements: [
    {
      id: 1,
      title: '2nd Prize — ICCS 2025 Poster Presentation',
      organization: 'International Conference on Computing & Science',
      date: '2025',
      type: 'Award',
      badge: '🥈 2nd Prize',
      description: 'Awarded 2nd Prize for technical poster presentation demonstrating high-clarity systems analysis and technical communication.',
    },
    {
      id: 2,
      title: '3rd Prize — ICCMST 2025 Poster Presentation',
      organization: 'ICCMST 2025 Research Conference',
      date: '2025',
      type: 'Award',
      badge: '🥉 3rd Prize',
      description: 'Secured 3rd place in competitive technical poster exhibition evaluating computational engineering methodologies.',
    },
    {
      id: 3,
      title: '3rd Prize — Innovation Canvas Exhibit 2k24',
      organization: 'College Innovation Symposium',
      date: '2024',
      type: 'Award',
      badge: '🥉 3rd Prize',
      description: 'Recognized for innovative prototype design and problem-solving execution at college-wide engineering exhibition.',
    },
    {
      id: 4,
      title: 'Smart India Hackathon (SIH) Participant',
      organization: 'Ministry of Education & SIH',
      date: '2024',
      type: 'Hackathon',
      badge: '🏆 SIH 2024',
      description: 'Built an Augmented Reality Cultural Heritage Preservation platform for national-level engineering competition.',
    },
    {
      id: 5,
      title: 'Coordinator in Career Sprint 2k25 & Technical Team Member',
      organization: 'CGC Landran College Club',
      date: '2024 — 2025',
      type: 'Leadership',
      badge: '⚡ Leadership',
      description: 'Active Technical Team member in college tech club; coordinated workshops and events in Career Sprint 2k25.',
    },
  ],

  // ---- Industry Certifications ----
  certifications: [
    {
      id: 1,
      title: 'Cloud Computing',
      issuer: 'Amazon Web Services (AWS)',
      type: 'Cloud Infrastructure',
      icon: '☁️',
    },
    {
      id: 2,
      title: 'Generative AI Foundations',
      issuer: 'Amazon Web Services (AWS)',
      type: 'Artificial Intelligence',
      icon: '🧠',
    },
    {
      id: 3,
      title: 'GitHub Fundamentals',
      issuer: 'Microsoft Learn',
      type: 'DevOps & Version Control',
      icon: '🐙',
    },
    {
      id: 4,
      title: 'Responsive Web Design',
      issuer: 'FreeCodeCamp',
      type: 'Frontend Engineering',
      icon: '💻',
    },
    {
      id: 5,
      title: 'Fundamentals of Operating Systems',
      issuer: 'LinkedIn Learning',
      type: 'Core Computer Science',
      icon: '⚙️',
    },
  ],

  // ---- GitHub Section ----
  github: {
    username: 'Sheshank110',
    url: 'https://github.com/Sheshank110',
    stats: {
      repos: '10+',
      contributions: 'Active',
      status: 'Open to Work',
    },
    featuredRepos: [
      {
        name: 'Life-Card-MERN',
        description: 'QR-enabled emergency response medical platform providing first responders with instant access to patient medical records.',
        language: 'JavaScript',
        stars: 4,
        url: 'https://github.com/Sheshank110',
      },
      {
        name: 'FitFlow-News-Engine',
        description: 'Dynamic news and article aggregation application with real-time JSON API fetching and keyword search.',
        language: 'JavaScript',
        stars: 3,
        url: 'https://github.com/Sheshank110',
      },
      {
        name: 'AR-Cultural-Heritage-SIH',
        description: 'Smart India Hackathon project — interactive Augmented Reality & 3D platform for cultural heritage preservation.',
        language: 'JavaScript',
        stars: 5,
        url: 'https://github.com/Sheshank110',
      },
      {
        name: 'mern-developer-portfolio',
        description: 'Full-stack MERN developer portfolio featuring dark editorial styling, micro-interactions, and MongoDB contact integration.',
        language: 'JavaScript',
        stars: 2,
        url: 'https://github.com/Sheshank110',
      },
      {
        name: 'Timeless-trends',
        description: 'Premium fashion e-commerce platform with AI stylist, Razorpay payments, admin dashboard, and full product management.',
        language: 'JavaScript',
        stars: 3,
        url: 'https://github.com/Sheshank110/Timeless-trends',
      },
    ],
  },

  // ---- Contact Section ----
  contact: {
    heading: "Have an idea? Let's build it together.",
    description: "I'm currently seeking software development internships, collaborative tech projects, and engineering opportunities. Feel free to connect directly!",
  },
};

export default portfolio;
