export function ResumeHeader() {
  return (
    <div className="border-b border-neutral-200 px-8 py-12 md:px-16">
      <h1 className="mb-1 tracking-tight">Logan McAnsh</h1>
      <p className="mb-6 text-neutral-600">Senior Software Engineer</p>

      <div className="grid gap-x-8 gap-y-1 text-sm text-neutral-600 md:grid-cols-2">
        <div>
          <span className="text-neutral-900">Email:</span>{" "}
          <a href="mailto:logan+resume@mcan.sh" target="_blank" rel="noopener noreferrer">
            logan+resume@mcan.sh
          </a>
        </div>
        <div>
          <span className="text-neutral-900">GitHub:</span>{" "}
          <a href="https://github.com/mcansh" target="_blank" rel="noopener noreferrer">
            github.com/mcansh
          </a>
        </div>
        <div>
          <span className="text-neutral-900">Location:</span> Shelby Township, MI
        </div>
        <div>
          <span className="text-neutral-900">LinkedIn:</span>{" "}
          <a href="https://linkedin.com/in/mcansh" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/mcansh
          </a>
        </div>
      </div>
    </div>
  )
}

export function ExperienceSection({
  experiences,
}: {
  experiences: ReadonlyArray<{
    company: string
    position: string
    startDate: string
    endDate: string
    note?: string
    tasks: string[]
  }>
}) {
  return (
    <div>
      <h2 className="mb-6 border-b border-neutral-300 pb-2">Experience</h2>
      <div className="space-y-8">
        {experiences.map((experience) => (
          <div className="relative" key={experience.company}>
            <div className="mb-4">
              <div className="mb-1 flex flex-col items-start justify-between md:flex-row">
                <h3 className="text-neutral-900">{experience.company}</h3>
                <span className="text-sm whitespace-nowrap text-neutral-500 md:ml-4">
                  {experience.startDate} - {experience.endDate}
                </span>
              </div>
              <p className="text-neutral-600">{experience.position}</p>
              {experience.note ? (
                <p className="mt-1 text-sm text-neutral-500 italic">{experience.note}</p>
              ) : null}
            </div>

            {experience.tasks.length > 0 && (
              <ul className="space-y-2 text-sm">
                {experience.tasks.map((task) => (
                  <li key={task} className="flex gap-3 leading-relaxed text-neutral-700">
                    <span className="mt-1.5 text-neutral-400 select-none">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkillsSection({
  skills,
}: {
  skills: ReadonlyArray<{
    category: string
    skills: string[]
  }>
}) {
  return (
    <div>
      <h2 className="mb-4 border-b border-neutral-300 pb-2">Skills</h2>
      <div className="space-y-4">
        {skills.map((category) => (
          <div key={category.category}>
            <div className="mb-2 text-sm text-neutral-500">{category.category}</div>
            <div className="space-y-1">
              {category.skills.map((skill) => {
                return (
                  <div key={skill} className="text-sm text-neutral-700">
                    {skill}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CertificationsSection({
  certifications,
}: {
  certifications: ReadonlyArray<string>
}) {
  return (
    <div>
      <h2 className="mb-4 border-b border-neutral-300 pb-2">Certifications</h2>
      <ul className="space-y-2">
        {certifications.map((cert, index) => (
          <li key={index} className="text-sm leading-relaxed text-neutral-700">
            {cert}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ReferencesSection({
  references,
}: {
  references: ReadonlyArray<{ name: string; href: string }>
}) {
  return (
    <div>
      <h2 className="mb-4 border-b border-neutral-300 pb-2">References</h2>
      <ul className="space-y-2">
        {references.map((ref) => (
          <li key={ref.name} className="text-sm text-neutral-700">
            {ref.name}{" "}
            {/*- <a href={ref.href} target="_blank" rel="noopener noreferrer">{ref.href}</a>*/}
          </li>
        ))}
      </ul>
    </div>
  )
}
