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

    return () => {
      active = false;
    };
  }, []);

  if (!loading && !error && members.length === 0) return null;

  return (
    <section id="team" className="section team-section" aria-labelledby="team-title">
      <div className="container-main">
        <div className="section-heading-row team-heading">
          <div>
            <p className="label">05 / Tim Kami</p>
            <h2 id="team-title" className="section-title">
              Orang-orang di balik ruang yang kami rancang.
            </h2>
          </div>

          <p className="section-heading-description">
            Kenali tim yang membantu menerjemahkan kebutuhan Anda menjadi
            arsitektur, interior, dan ruang yang lebih tepat.
          </p>
        </div>

        {loading ? (
          <div className="team-loading" aria-live="polite">
            Memuat profil tim...
          </div>
        ) : error ? (
          <div className="team-loading" role="status">
            Profil tim belum dapat dimuat. Silakan coba lagi nanti.
          </div>
        ) : (
          <div className="team-grid">
            {members.map((member) => (
              <article key={member.id} className="team-card">
                <div className="team-photo-wrap">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={`Foto ${member.name}`}
                      className="team-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="team-photo-placeholder" aria-hidden="true">
                      <span>{member.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="team-card-body">
                  <div className="team-card-topline">
                    <span className="team-role">{member.position}</span>
                    <span className="team-index">
                      {String(member.sort_order + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3>{member.name}</h3>

                  {member.bio && <p>{member.bio}</p>}

                  {member.skills.length > 0 && (
                    <ul className="team-skills" aria-label={`Keahlian ${member.name}`}>
                      {member.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
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
