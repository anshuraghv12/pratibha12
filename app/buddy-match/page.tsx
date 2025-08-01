"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Users, MessageCircle, Search, Filter, MapPin, Clock, Target, Zap, ArrowLeft } from "lucide-react";

export default function BuddyMatchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const loadMatches = async () => {
      try {
        setLoading(true);
        
        // Load user profile from localStorage
        const savedProfile = localStorage.getItem('user_profile');
        if (!savedProfile) {
          setError("Please complete your profile first.");
          setLoading(false);
          return;
        }

        const userProfile = JSON.parse(savedProfile);
        
        // Generate mock matches for demo
        const mockMatches = generateMockMatches(userProfile);
        setMatches(mockMatches);
        setError("");
      } catch (error) {
        console.error('Error loading matches:', error);
        setError("Failed to load matches");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // Generate mock matches for demo
  const generateMockMatches = (userProfile: any) => {
    const mockUsers = [
      {
        uid: "1",
        name: "Alex Johnson",
        role: "buddy",
        skills: ["javascript", "react", "python"],
        interests: ["web development", "AI", "startups"],
        goals: "Build a successful tech career and help others grow",
        availability: ["monday", "wednesday", "friday"],
        location: "San Francisco, CA",
        profilePicUrl: "",
        bio: "Passionate developer looking for study partners"
      },
      {
        uid: "2",
        name: "Sarah Chen",
        role: "buddy",
        skills: ["python", "data science", "machine learning"],
        interests: ["AI", "research", "statistics"],
        goals: "Master data science and contribute to research",
        availability: ["tuesday", "thursday", "weekends"],
        location: "New York, NY",
        profilePicUrl: "",
        bio: "Data science enthusiast seeking collaboration"
      },
      {
        uid: "3",
        name: "Mike Rodriguez",
        role: "buddy",
        skills: ["java", "android", "mobile development"],
        interests: ["mobile apps", "entrepreneurship", "design"],
        goals: "Launch my own mobile app startup",
        availability: ["evenings", "weekends"],
        location: "Austin, TX",
        profilePicUrl: "",
        bio: "Mobile developer with startup dreams"
      }
    ];

    return mockUsers.map((user, index) => ({
      user,
      score: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
    }));
  };

  const filteredMatches = matches.filter((m) => {
    const buddy = m.user;
    return (
      buddy.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (buddy.skills || []).some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (buddy.goals || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFEEC] via-white to-[#FFFFEEC]">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#CBD83B] to-[#A88AED] rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#CBD83B] to-[#A88AED] bg-clip-text text-transparent">
                PeerUP
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3 text-[#CBD83B]" />
            Find Your Study Buddy
          </h1>
          <p className="text-xl text-gray-600">
            Connect with like-minded peers who share your goals and learning style
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, skills, or goals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl border-gray-200 focus:border-[#CBD83B] focus:ring-[#CBD83B]"
                  />
                </div>
                <Button variant="outline" className="rounded-xl bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Match Results */}
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Loading matches...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid gap-6">
            {filteredMatches.map((m) => {
              const buddy = m.user;
              return (
                <Card
                  key={buddy.uid}
                  className="border-0 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Profile Section */}
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={buddy.profilePicUrl || "/placeholder.svg"} />
                            <AvatarFallback>
                              {buddy.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{buddy.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4 text-[#CBD83B]" />
                              <span className="text-lg font-bold text-[#CBD83B]">{m.score}%</span>
                              <span className="text-sm text-gray-600">match</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{buddy.bio || "No bio provided."}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(buddy.skills || []).map((skill: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-[#CBD83B]/20 text-[#CBD83B] hover:bg-[#CBD83B]/30"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="lg:w-80 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Target className="w-4 h-4" />
                            <span>{buddy.goals}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{buddy.location || "-"}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{(buddy.availability || []).join(", ")}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button className="flex-1 bg-[#CBD83B] hover:bg-[#CBD83B]/90 text-black rounded-xl">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl border-[#A88AED] text-[#A88AED] hover:bg-[#A88AED]/10 bg-transparent"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredMatches.length === 0 && (
          <Card className="border-0 shadow-lg rounded-3xl">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or check back later for new buddy matches.
              </p>
              <Button className="bg-[#CBD83B] hover:bg-[#CBD83B]/90 text-black rounded-xl">
                Update My Preferences
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
