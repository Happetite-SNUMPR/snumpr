import Title from '@/components/Title';
import styles from './page.module.css';
import peopleData from '../../../public/data/people.json';

interface Member {
  name: string;
  position: string;
  image: string;
  website?: string | null;
  email?: string | null;
  github?: string | null;
}

interface Alumnus {
  name: string;
  degree: string;
  current: string;
  website?: string;
}

const sections: { key: keyof typeof peopleData.members; title: string }[] = [
  { key: 'faculty_and_researchers', title: 'Faculty & Researchers' },
  { key: 'graduate_students', title: 'Graduate Students' },
  { key: 'undergraduate_interns', title: 'Undergraduate Interns' },
  { key: 'robots', title: 'Robots' },
  { key: 'administrative_staff', title: 'Administrative Staff' },
];

function MemberCard({ member }: { member: Member }) {
  const links = [
    { url: member.website, label: 'Website', icon: '/icons/team/website.svg' },
    {
      url: member.email ? `mailto:${member.email}` : null,
      label: 'Email',
      icon: '/icons/team/email.svg',
    },
    { url: member.github, label: 'GitHub', icon: '/icons/team/github.svg' },
  ].filter((link) => link.url);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={member.image} alt={member.name} />
      </div>
      <span className={`${styles.name} ${member.name.length > 15 ? styles.nameSmall : ''}`}>
        {member.name}
      </span>
      <span className={styles.position}>{member.position}</span>
      {links.length > 0 && (
        <div className={styles.links}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBox}
              aria-label={link.label}
            >
              <img src={link.icon} alt={link.label} className={styles.linkIcon} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function AlumniSection({
  title,
  subtitle,
  members,
}: {
  title: string;
  subtitle?: string;
  members: Alumnus[];
}) {
  return (
    <section className={styles.alumniSection}>
      <div className={styles.alumniHeader}>
        <div>
          <h2 className={styles.alumniTitle}>{title}</h2>
          {subtitle && <span className={styles.alumniSubtitle}>{subtitle}</span>}
        </div>
        <div className={styles.alumniList}>
          {members.map((member) => (
            <div key={member.name} className={styles.alumniRow}>
              <span>
                {member.website ? (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.alumniNameLink}
                  >
                    {member.name}
                  </a>
                ) : (
                  <span className={styles.alumniName}>{member.name}</span>
                )}
              </span>
              <span className={styles.alumniDegree}>
                ({member.degree}) {member.current}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TeamPage() {
  return (
    <div className={styles.pageContainer}>
      <Title title="Our Team" />
      {sections.map(({ key, title }) => {
        const members = peopleData.members[key] as Member[];
        return (
          <section key={key} className={styles.section}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <div className={styles.grid}>
              {members.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </section>
        );
      })}
      <AlumniSection title="Alumni" members={peopleData.members.alumni_graduate as Alumnus[]} />
      <AlumniSection
        title="Alumni"
        subtitle="(Undergraduate Interns)"
        members={peopleData.members.alumni_undergraduate as Alumnus[]}
      />
    </div>
  );
}
