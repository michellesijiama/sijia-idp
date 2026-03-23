import { Category, UserSettings, IDPState } from './types'

export const DEFAULT_SETTINGS: UserSettings = {
  name: 'Alex Johnson',
  title: 'Senior Software Engineer',
  department: 'Engineering',
  manager: 'Sarah Chen',
  year: 2026,
}

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Technical Excellence',
    description: 'Deepen technical skills and earn industry-recognized credentials',
    order: 0,
    subCategories: [
      {
        id: 'sub-1-1',
        name: 'Cloud & Infrastructure',
        description: 'Cloud architecture and infrastructure expertise',
        order: 0,
        objectives: [
          {
            id: 'obj-1-1-1',
            title: 'AWS Solutions Architect Certification',
            description:
              'Obtain the AWS Certified Solutions Architect \u2013 Associate certification to deepen cloud infrastructure expertise and enable more effective architecture decisions for team projects.',
            deadline: '2026-06-30',
            status: 'In Progress',
            progress: 65,
            evidence: [
              {
                id: 'ev-1',
                type: 'link',
                url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
                title: 'AWS Study Guide',
                addedAt: '2026-02-15T14:30:00Z',
              },
              {
                id: 'ev-2',
                type: 'link',
                url: 'https://acloudguru.com',
                title: 'A Cloud Guru Course Completion',
                addedAt: '2026-03-01T10:00:00Z',
              },
            ],
            createdAt: '2026-01-05T09:00:00Z',
            updatedAt: '2026-03-01T10:00:00Z',
          },
        ],
      },
      {
        id: 'sub-1-2',
        name: 'Software Engineering',
        description: 'Core engineering practices and design patterns',
        order: 1,
        objectives: [
          {
            id: 'obj-1-2-1',
            title: 'Master System Design Patterns',
            description:
              'Study and apply key distributed system design patterns (CQRS, event sourcing, saga pattern) to real team projects.',
            deadline: '2026-09-30',
            status: 'In Progress',
            progress: 40,
            evidence: [
              {
                id: 'ev-3',
                type: 'image',
                url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400',
                title: 'System design whiteboard session',
                addedAt: '2026-02-20T11:00:00Z',
              },
            ],
            createdAt: '2026-01-10T09:00:00Z',
            updatedAt: '2026-02-20T11:00:00Z',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-2',
    name: 'Leadership & Impact',
    description: 'Develop leadership skills and broaden organizational impact',
    order: 1,
    subCategories: [
      {
        id: 'sub-2-1',
        name: 'Team Leadership',
        description: 'Lead teams and cross-functional initiatives',
        order: 0,
        objectives: [
          {
            id: 'obj-2-1-1',
            title: 'Lead Cross-Functional Project',
            description:
              'Take ownership of leading the Q2 platform migration project, coordinating across Engineering, Product, and Design teams to deliver on time and within scope.',
            deadline: '2026-08-31',
            status: 'In Progress',
            progress: 50,
            evidence: [
              {
                id: 'ev-4',
                type: 'link',
                url: 'https://confluence.example.com/project-charter',
                title: 'Project Charter Document',
                addedAt: '2026-02-03T11:00:00Z',
              },
            ],
            createdAt: '2026-01-12T09:00:00Z',
            updatedAt: '2026-03-10T11:00:00Z',
          },
        ],
      },
      {
        id: 'sub-2-2',
        name: 'Knowledge Sharing',
        description: 'Share expertise and contribute to engineering culture',
        order: 1,
        objectives: [
          {
            id: 'obj-2-2-1',
            title: 'Present at 2 Tech Talks',
            description:
              'Share technical knowledge and insights with the broader engineering organization by delivering two well-prepared internal tech talk presentations.',
            deadline: '2026-03-31',
            status: 'Completed',
            progress: 100,
            evidence: [
              {
                id: 'ev-5',
                type: 'link',
                url: 'https://drive.google.com/slides/react-performance',
                title: 'React Performance Talk Slides',
                addedAt: '2026-01-28T16:00:00Z',
              },
              {
                id: 'ev-6',
                type: 'link',
                url: 'https://drive.google.com/slides/typescript-patterns',
                title: 'TypeScript Patterns Talk Slides',
                addedAt: '2026-03-12T16:30:00Z',
              },
            ],
            createdAt: '2026-01-05T09:00:00Z',
            updatedAt: '2026-03-12T16:30:00Z',
          },
        ],
      },
    ],
  },
  {
    id: 'cat-3',
    name: 'Professional Growth',
    description: 'Invest in personal development and mentorship',
    order: 2,
    subCategories: [
      {
        id: 'sub-3-1',
        name: 'Mentorship',
        description: 'Guide and develop junior team members',
        order: 0,
        objectives: [
          {
            id: 'obj-3-1-1',
            title: 'Mentor 2 Junior Engineers',
            description:
              'Provide structured mentorship to two junior engineers on the team, meeting bi-weekly to support their technical growth, career development, and onboarding.',
            deadline: '2026-12-31',
            status: 'In Progress',
            progress: 75,
            evidence: [
              {
                id: 'ev-7',
                type: 'link',
                url: 'https://docs.google.com/mentorship-log',
                title: 'Mentorship Session Log',
                addedAt: '2026-01-25T15:00:00Z',
              },
            ],
            createdAt: '2026-01-18T09:00:00Z',
            updatedAt: '2026-03-31T17:00:00Z',
          },
        ],
      },
    ],
  },
]

export const SAMPLE_STATE: IDPState = {
  categories: SAMPLE_CATEGORIES,
  settings: DEFAULT_SETTINGS,
  activeYear: DEFAULT_SETTINGS.year,
}
