export function ResumeHeader() {
	return (
		<div className="border-b border-neutral-200 px-16 py-12">
			<h1 className="mb-1 tracking-tight">Logan McAnsh</h1>
			<p className="text-neutral-600 mb-6">Senior Software Engineer</p>

			<div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-neutral-600">
				<div>
					<span className="text-neutral-900">Email:</span>{" "}
					<a
						href="mailto:logan+resume@mcan.sh"
						target="_blank"
						rel="noopener noreferrer"
					>
						logan+resume@mcan.sh
					</a>
				</div>
				<div>
					<span className="text-neutral-900">GitHub:</span>{" "}
					<a
						href="https://github.com/mcansh"
						target="_blank"
						rel="noopener noreferrer"
					>
						github.com/mcansh
					</a>
				</div>
				<div>
					<span className="text-neutral-900">Location:</span> Shelby Township,
					MI
				</div>
				<div>
					<span className="text-neutral-900">LinkedIn:</span>{" "}
					<a
						href="https://linkedin.com/in/mcansh"
						target="_blank"
						rel="noopener noreferrer"
					>
						linkedin.com/in/mcansh
					</a>
				</div>
			</div>
		</div>
	);
}

export function ExperienceSection({
	experiences,
}: {
	experiences: ReadonlyArray<{
		company: string;
		position: string;
		startDate: string;
		endDate: string;
		note?: string;
		tasks: string[];
	}>;
}) {
	return (
		<div>
			<h2 className="mb-6 pb-2 border-b border-neutral-300">Experience</h2>
			<div className="space-y-8">
				{experiences.map((experience) => {
					return (
						<div className="relative" key={experience.company}>
							<div className="mb-4">
								<div className="flex items-start justify-between mb-1">
									<h3 className="text-neutral-900">{experience.company}</h3>
									<span className="text-sm text-neutral-500 whitespace-nowrap ml-4">{`${experience.startDate} - ${experience.endDate}`}</span>
								</div>
								<p className="text-neutral-600">{experience.position}</p>
								{experience.note ? (
									<p className="text-sm text-neutral-500 italic mt-1">
										{experience.note}
									</p>
								) : null}
							</div>

							{experience.tasks.length > 0 && (
								<ul className="space-y-2 text-sm">
									{experience.tasks.map((task) => (
										<li
											key={task}
											className="flex gap-3 text-neutral-700 leading-relaxed"
										>
											<span className="text-neutral-400 mt-1.5 select-none">
												•
											</span>
											<span>{task}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function SkillsSection({
	skills,
}: {
	skills: ReadonlyArray<{
		category: string;
		skills: string[];
	}>;
}) {
	return (
		<div>
			<h2 className="mb-4 pb-2 border-b border-neutral-300">Skills</h2>
			<div className="space-y-4">
				{skills.map((category) => {
					return (
						<div key={category.category}>
							<div className="text-sm text-neutral-500 mb-2">
								{category.category}
							</div>
							<div className="space-y-1">
								{category.skills.map((skill) => {
									return (
										<div key={skill} className="text-sm text-neutral-700">
											{skill}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function CertificationsSection({
	certifications,
}: {
	certifications: ReadonlyArray<string>;
}) {
	return (
		<div>
			<h2 className="mb-4 pb-2 border-b border-neutral-300">Certifications</h2>
			<ul className="space-y-2">
				{certifications.map((cert, index) => {
					return (
						<li
							key={index}
							className="text-sm text-neutral-700 leading-relaxed"
						>
							{cert}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export function ReferencesSection({
	references,
}: {
	references: ReadonlyArray<{ name: string; href: string }>;
}) {
	return (
		<div>
			<h2 className="mb-4 pb-2 border-b border-neutral-300">References</h2>
			<ul className="space-y-2">
				{references.map((ref) => (
					<li key={ref.name} className="text-sm text-neutral-700">
						{ref.name}{" "}
						{/*- <a href={ref.href} target="_blank" rel="noopener noreferrer">{ref.href}</a>*/}
					</li>
				))}
			</ul>
		</div>
	);
}
