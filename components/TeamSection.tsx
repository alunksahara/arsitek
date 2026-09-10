"use client";

import { useEffect, useState } from "react";

type TeamMember = {
  id: string;
  name: string;
  photo_url: string | null;
  position: string;
  bio: string;
  skills: string[];
  sort_order: number;
  published: boolean;
};

export default function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTeam() {
      try {
        const response = await fetch("/api/team", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load team");
        const data = await response.json();
        if (!active) return;
        setMembers(Array.isArray(data.team) ? data.team : []);
        setError(false);
      } catch (err) {
        console.error("[PUBLIC TEAM]", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTeam();
    return () => { active = false; };
  }, []);

  if (!loading && !error && members.length === 0) return null;

  return (
    <section id="team" className="section bg-[#f7f8f5]" aria-labelledby="team-title">
      <div className="container-main">
        <div className="section-heading-row">
          <div>
            <p className="label">05 / Tim Kami</p>
            <h2 id="team-title" className="section-title">Orang-orang di balik ruang yang kami rancang.</h2>
          </div>
          <p className="section-heading-description">Kenali tim yang membantu menerjemahkan kebutuhan Anda menjadi arsitektur, interior, dan ruang yang lebih tepat.</p>
        </div>

        {loading ? (
          <div className="py-12 text-sm text-[#58615b]" aria-live="polite">Memuat profil tim...</div>
        ) : error ? (
          <div className="py-12 text-sm text-[#58615b]" role="status">Profil tim belum dapat dimuat. Silakan coba lagi nanti.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <article key={member.id} className="overflow-hidden border border-[#dfe3df] bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(24,35,28,0.08)]">
                <div className="aspect-[4/3] overflow-hidden bg-[#e9f1eb]">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={`Foto ${member.name}`} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-[#e9f1eb] text-5xl font-serif text-[#24563b]" aria-hidden="true">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#24563b]">{member.position}</span>
                    <span className="text-[11px] text-[#77736c]">{String(member.sort_order + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-normal tracking-[-0.035em] text-[#151916]">{member.name}</h3>
                  {member.bio && <p className="mt-3 text-sm leading-7 text-[#58615b]">{member.bio}</p>}
                  {member.skills.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Keahlian ${member.name}`}>
                      {member.skills.map((skill) => <li key={skill} className="border border-[#dfe3df] px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-[#58615b]">{skill}</li>)}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
