import Fuse from 'fuse.js';

const masterSkills = [
  'graphic design', 'web development', 'ui/ux', 'content writing',
  'marketing', 'python', 'java', 'javascript', 'freelancing',
  // ...extend with other popular skills
];
const fuse = new Fuse(masterSkills, { threshold: 0.3 });

function normalizeSkill(input) {
  if (!input) return "";
  input = input.trim().toLowerCase();
  const result = fuse.search(input);
  return result.length ? result[0].item : input;
}

function matchScore(user, candidate) {
  let score = 0;
  // Skills (fuzzy normalized)
  const userSkills = (user.skills || []).map(normalizeSkill);
  const candidateSkills = (candidate.skills || []).map(normalizeSkill);
  userSkills.forEach(skill => {
    if (candidateSkills.includes(skill)) score += 3;
  });
  // Interests
  const userInterests = (user.interests || []).map(s => s.toLowerCase());
  const candidateInterests = (candidate.interests || []).map(s => s.toLowerCase());
  userInterests.forEach(interest => {
    if (candidateInterests.includes(interest)) score += 2;
  });
  // Availability
  const userAvail = (user.availability || []).map(a => a.toLowerCase());
  const candidateAvail = (candidate.availability || []).map(a => a.toLowerCase());
  userAvail.forEach(a => {
    if (candidateAvail.includes(a)) score += 2;
  });
  // Goal alignment
  if (user.goals) {
    const goalsLower = user.goals.toLowerCase();
    candidateSkills.forEach(skill => {
      if (goalsLower.includes(skill)) score += 2;
    });
  }
  return score;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userProfile } = req.body;
  if (!userProfile) {
    return res.status(400).json({ error: 'Missing userProfile in body' });
  }
  try {
    // Generate mock users for demo
    const mockUsers = [
      {
        uid: "1",
        name: "Alex Johnson",
        role: "buddy",
        skills: ["javascript", "react", "python"],
        interests: ["web development", "AI", "startups"],
        goals: "Build a successful tech career and help others grow",
        availability: ["monday", "wednesday", "friday"],
        location: "San Francisco, CA"
      },
      {
        uid: "2",
        name: "Sarah Chen",
        role: "buddy",
        skills: ["python", "data science", "machine learning"],
        interests: ["AI", "research", "statistics"],
        goals: "Master data science and contribute to research",
        availability: ["tuesday", "thursday", "weekends"],
        location: "New York, NY"
      }
    ];
    
    // Filter out self and same role (customize as needed)
    const candidates = mockUsers.filter(
      u => u.uid !== userProfile.uid && u.role !== userProfile.role
    );
    // Score and sort
    const scored = candidates
      .map(candidate => ({ user: candidate, score: matchScore(userProfile, candidate) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 matches
    res.status(200).json({ matches: scored });
  } catch (e) {
    console.error('Error in /api/match/buddy:', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
} 