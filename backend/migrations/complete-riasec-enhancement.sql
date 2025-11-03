-- Complete RIASEC Enhancement - Add Missing Fields and Full Data
-- Run: sudo -u postgres psql -d elimu_smart_production < complete-riasec-enhancement.sql

-- First, add missing columns if they don't exist
DO $$
BEGIN
    -- Add strengths column (JSONB array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'strengths') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "strengths" JSONB;
    END IF;

    -- Add workStyle column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'workStyle') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "workStyle" TEXT;
    END IF;

    -- Add motivators column (JSONB array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'motivators') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "motivators" JSONB;
    END IF;

    -- Add learningStyle column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'learningStyle') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "learningStyle" TEXT;
    END IF;

    -- Add decisionMaking column (may already exist)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'decisionMaking') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "decisionMaking" TEXT;
    END IF;

    -- Add teamRole column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'teamRole') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "teamRole" TEXT;
    END IF;

    -- Add top3CareerMatches column (JSONB array) (may already exist)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'top3CareerMatches') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "top3CareerMatches" JSONB;
    END IF;

    -- Add famousKenyans column (JSONB array) (may already exist)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'famousKenyans') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "famousKenyans" JSONB;
    END IF;

    -- Add avatarSuggestions column (JSONB object) (may already exist)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'RiasecTypeInfo' AND column_name = 'avatarSuggestions') THEN
        ALTER TABLE "RiasecTypeInfo" ADD COLUMN "avatarSuggestions" JSONB;
    END IF;
END $$;

-- R - The Craftsman (Complete Data)
UPDATE "RiasecTypeInfo" SET
  "strengths" = '["Technical expertise", "Problem-solving with tools", "Mechanical reasoning", "Spatial awareness", "Physical stamina"]'::jsonb,
  "workStyle" = 'Prefer hands-on work with tangible objects, machinery, and tools. Value concrete results and practical solutions. Often work independently or in small technical teams.',
  "motivators" = '["Building and creating things", "Seeing tangible results", "Working outdoors", "Using specialized equipment", "Solving practical problems"]'::jsonb,
  "learningStyle" = 'Learning by doing - prefer hands-on practice, demonstrations, and real-world application over lectures.',
  "decisionMaking" = 'Practical and logical - focus on what works in real situations, value efficiency and proven methods.',
  "teamRole" = 'The Builder - brings technical expertise and practical solutions to challenges',
  "top3CareerMatches" = '[
    {
      "career": "Mechanical Engineer",
      "compatibility": 95.0,
      "reason": "Perfect blend of hands-on work, technical problem-solving, and creating tangible solutions",
      "kenyaOpportunities": "JKUAT, UoN Engineering programs; Kenya Railways, manufacturing sector"
    },
    {
      "career": "Automotive Technician",
      "compatibility": 92.0,
      "reason": "Direct hands-on work with machinery, diagnostic problem-solving, and practical skill application",
      "kenyaOpportunities": "Technical training colleges; Toyota Kenya, General Motors EA, auto repair businesses"
    },
    {
      "career": "Construction Manager",
      "compatibility": 88.0,
      "reason": "Combines practical building knowledge with project oversight and tangible results",
      "kenyaOpportunities": "TU-K construction management; China Roads, ARM Cement, private contractors"
    }
  ]'::jsonb,
  "famousKenyans" = '["Philip Nyakiamo (Tech Innovator & Engineer)", "Mbithi Masya (Infrastructure Engineer)", "James Macharia (Cabinet Secretary for Infrastructure)"]'::jsonb,
  "avatarSuggestions" = '{
    "style": "Professional with tools/equipment",
    "colors": ["#ef4444", "#dc2626"],
    "attributes": ["focused expression", "technical gear", "builder aesthetic"]
  }'::jsonb
WHERE code = 'R';

-- I - The Analyst (Complete Data)
UPDATE "RiasecTypeInfo" SET
  "strengths" = '["Critical thinking", "Scientific reasoning", "Data analysis", "Mathematical skills", "Research methodology"]'::jsonb,
  "workStyle" = 'Prefer working with abstract ideas, research, and data. Value intellectual challenges and methodical problem-solving. Often work independently on complex projects.',
  "motivators" = '["Solving complex problems", "Making new discoveries", "Understanding how things work", "Intellectual challenges", "Contributing to knowledge"]'::jsonb,
  "learningStyle" = 'Learning through investigation - prefer deep analysis, research, and understanding theory before application.',
  "decisionMaking" = 'Data-driven and methodical - require evidence and logical reasoning before reaching conclusions.',
  "teamRole" = 'The Analyst - brings critical thinking, research expertise, and data-driven insights',
  "top3CareerMatches" = '[
    {
      "career": "Software Developer",
      "compatibility": 96.0,
      "reason": "Perfect match for analytical thinking, problem-solving, and logical system design",
      "kenyaOpportunities": "Strathmore, JKUAT, UoN Computer Science; Safaricom, Andela, tech startups"
    },
    {
      "career": "Data Scientist",
      "compatibility": 94.0,
      "reason": "Combines research, statistical analysis, and discovering insights from complex data",
      "kenyaOpportunities": "UoN Data Science; banks, telcos, research institutions, KEMRI"
    },
    {
      "career": "Medical Doctor",
      "compatibility": 90.0,
      "reason": "Requires analytical diagnosis, research-based treatment, and continuous learning",
      "kenyaOpportunities": "UoN, Moi University Medicine; Kenyatta Hospital, Aga Khan, private practice"
    }
  ]'::jsonb,
  "famousKenyans" = '["Prof. Wangari Maathai (Nobel Laureate, Environmental Scientist)", "Dr. Calestous Juma (Innovation Scholar)", "Prof. Ruth Nita Barrow (Medical Researcher)"]'::jsonb,
  "avatarSuggestions" = '{
    "style": "Intellectual/professional with glasses",
    "colors": ["#3b82f6", "#2563eb"],
    "attributes": ["thoughtful expression", "lab coat or professional attire", "analytical aesthetic"]
  }'::jsonb
WHERE code = 'I';

-- A - The Innovator (Complete Data)
UPDATE "RiasecTypeInfo" SET
  "strengths" = '["Creative problem-solving", "Artistic expression", "Innovation", "Design thinking", "Visual communication"]'::jsonb,
  "workStyle" = 'Prefer working with ideas, design, and artistic media. Value originality and creative freedom. Often work independently with flexible schedules.',
  "motivators" = '["Self-expression", "Creating something new", "Aesthetic beauty", "Innovation", "Recognition for creativity"]'::jsonb,
  "learningStyle" = 'Learning through exploration - prefer creative experimentation, visual methods, and freedom to discover.',
  "decisionMaking" = 'Intuitive and imaginative - trust instincts, creative vision, and aesthetic judgment.',
  "teamRole" = 'The Innovator - brings fresh perspectives, creative solutions, and innovative thinking',
  "top3CareerMatches" = '[
    {
      "career": "UI/UX Designer",
      "compatibility": 97.0,
      "reason": "Perfect blend of creativity, user-centered thinking, and digital innovation",
      "kenyaOpportunities": "Design schools; tech companies, Safaricom, creative agencies, freelance"
    },
    {
      "career": "Graphic Designer",
      "compatibility": 95.0,
      "reason": "Direct creative expression through visual communication and brand storytelling",
      "kenyaOpportunities": "Multimedia University; advertising agencies, media houses, corporate brands"
    },
    {
      "career": "Architect",
      "compatibility": 91.0,
      "reason": "Combines artistic vision with functional design and spatial creativity",
      "kenyaOpportunities": "UoN, JKUAT Architecture; architectural firms, real estate developers"
    }
  ]'::jsonb,
  "famousKenyans" = '["Lupita Nyong''o (Academy Award-winning Actress)", "Eric Wainaina (Musician & Creative Director)", "Wangechi Mutu (Internationally Acclaimed Artist)"]'::jsonb,
  "avatarSuggestions" = '{
    "style": "Artistic/creative with unique flair",
    "colors": ["#a855f7", "#9333ea"],
    "attributes": ["creative expression", "artistic accessories", "unique style"]
  }'::jsonb
WHERE code = 'A';

-- S - The Advocate (Complete Data)
UPDATE "RiasecTypeInfo" SET
  "strengths" = '["Interpersonal communication", "Empathy and compassion", "Teaching and mentoring", "Conflict resolution", "Active listening"]'::jsonb,
  "workStyle" = 'Prefer working directly with people to teach, care, or support. Value relationships and community impact. Thrive in collaborative environments.',
  "motivators" = '["Helping others", "Making a difference", "Building relationships", "Community impact", "Personal growth of others"]'::jsonb,
  "learningStyle" = 'Learning through collaboration - prefer group discussions, mentorship, and social interaction.',
  "decisionMaking" = 'Values-based and collaborative - consider impact on people first, seek consensus.',
  "teamRole" = 'The Advocate - builds team cohesion, supports members, and champions others'' needs',
  "top3CareerMatches" = '[
    {
      "career": "Teacher",
      "compatibility": 96.0,
      "reason": "Perfect alignment with helping others learn, mentoring, and shaping young minds",
      "kenyaOpportunities": "Kenyatta, Moi, Egerton Education; TSC, private schools, tutoring centers"
    },
    {
      "career": "Counselor",
      "compatibility": 94.0,
      "reason": "Direct people support, empathy-driven work, and helping others overcome challenges",
      "kenyaOpportunities": "Daystar, Kenyatta Counseling Psychology; schools, NGOs, hospitals"
    },
    {
      "career": "Nurse",
      "compatibility": 92.0,
      "reason": "Combines caring for others, healthcare knowledge, and patient advocacy",
      "kenyaOpportunities": "UoN, KMTC Nursing; hospitals, clinics, community health programs"
    }
  ]'::jsonb,
  "famousKenyans" = '["Dr. Khama Rogo (Public Health Leader)", "Juliana Rotich (Social Entrepreneur & Humanitarian)", "Boniface Mwangi (Social Activist)"]'::jsonb,
  "avatarSuggestions" = '{
    "style": "Warm and approachable",
    "colors": ["#10b981", "#059669"],
    "attributes": ["friendly smile", "welcoming posture", "caring aesthetic"]
  }'::jsonb
WHERE code = 'S';

-- E - The Commander (Complete Data)
UPDATE "RiasecTypeInfo" SET
  "strengths" = '["Leadership and influence", "Strategic thinking", "Business acumen", "Negotiation skills", "Risk-taking ability"]'::jsonb,
  "workStyle" = 'Prefer leading projects, managing teams, and driving business results. Value achievement and influence. Thrive in competitive environments.',
  "motivators" = '["Achievement and success", "Influence and status", "Financial rewards", "Competition", "Recognition"]'::jsonb,
  "learningStyle" = 'Learning through action - prefer real-world application, case studies, and immediate implementation.',
  "decisionMaking" = 'Results-oriented and strategic - focus on outcomes, ROI, and competitive advantage.',
  "teamRole" = 'The Commander - drives vision, motivates teams, and leads toward ambitious goals',
  "top3CareerMatches" = '[
    {
      "career": "Business Owner/Entrepreneur",
      "compatibility": 98.0,
      "reason": "Ultimate expression of leadership, risk-taking, and driving business success",
      "kenyaOpportunities": "Strathmore, UoN Business; startup ecosystem, SME sector, franchising"
    },
    {
      "career": "Sales Manager",
      "compatibility": 95.0,
      "reason": "Combines persuasion, competition, and achieving measurable results",
      "kenyaOpportunities": "Business schools; retail, real estate, insurance, tech sales, FMCG"
    },
    {
      "career": "Marketing Director",
      "compatibility": 92.0,
      "reason": "Strategic thinking, brand influence, and driving business growth through campaigns",
      "kenyaOpportunities": "UoN, Strathmore Marketing; agencies, corporate brands, digital marketing"
    }
  ]'::jsonb,
  "famousKenyans" = '["James Mwangi (Equity Bank Group CEO)", "Tabitha Karanja (Keroche Breweries Founder)", "Chris Kirubi (Business Magnate - Legacy)"]'::jsonb,
  "avatarSuggestions" = '{
    "style": "Professional and confident",
    "colors": ["#eab308", "#ca8a04"],
    "attributes": ["confident posture", "business attire", "leadership aesthetic"]
  }'::jsonb
WHERE code = 'E';

-- C - The Coordinator (Complete Data)
UPDATE "RiasecTypeInfo" SET
  "strengths" = '["Attention to detail", "Organization skills", "Data management", "Process efficiency", "Quality assurance"]'::jsonb,
  "workStyle" = 'Prefer working with data, systems, and established procedures. Value accuracy and efficiency. Thrive in structured environments with clear expectations.',
  "motivators" = '["Order and structure", "Accuracy and precision", "Clear expectations", "System optimization", "Quality standards"]'::jsonb,
  "learningStyle" = 'Learning through structure - prefer step-by-step systematic instruction, manuals, and clear guidelines.',
  "decisionMaking" = 'Methodical and rule-based - follow proven processes, standards, and established best practices.',
  "teamRole" = 'The Coordinator - ensures quality, compliance, systematic execution, and organizational efficiency',
  "top3CareerMatches" = '[
    {
      "career": "Accountant",
      "compatibility": 97.0,
      "reason": "Perfect match for detail work, numerical precision, and systematic financial management",
      "kenyaOpportunities": "Strathmore, UoN Accounting; CPA-K, audit firms, banks, corporate finance"
    },
    {
      "career": "Bank Manager",
      "compatibility": 93.0,
      "reason": "Combines organizational skills, financial systems, and procedural management",
      "kenyaOpportunities": "Banking qualifications; KCB, Equity, Co-op Bank, microfinance institutions"
    },
    {
      "career": "Data Analyst",
      "compatibility": 90.0,
      "reason": "Detail-oriented data work, systematic analysis, and quality assurance",
      "kenyaOpportunities": "Data analysis programs; banks, telcos, research firms, government agencies"
    }
  ]'::jsonb,
  "famousKenyans" = '["Betty Maina (Industry & Trade - Standards Expert)", "Patrick Njoroge (Former CBK Governor - Financial Systems)", "Nancy Gitau (Financial Systems & Compliance)"]'::jsonb,
  "avatarSuggestions" = '{
    "style": "Professional and precise",
    "colors": ["#6b7280", "#4b5563"],
    "attributes": ["neat appearance", "professional attire", "organized aesthetic"]
  }'::jsonb
WHERE code = 'C';

-- Verify migration
SELECT code, name, "personalityTypeName",
       CASE WHEN "strengths" IS NOT NULL THEN 'Yes' ELSE 'No' END as has_strengths,
       CASE WHEN "top3CareerMatches" IS NOT NULL THEN 'Yes' ELSE 'No' END as has_careers,
       CASE WHEN "famousKenyans" IS NOT NULL THEN 'Yes' ELSE 'No' END as has_kenyans
FROM "RiasecTypeInfo"
ORDER BY code;
