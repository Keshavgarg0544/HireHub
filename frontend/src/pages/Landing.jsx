import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const stats = [
    { number: '84K+', label: 'Active job listings' },
    { number: '23K+', label: 'Verified companies' },
    { number: '1.2M', label: 'Successful hires' },
    { number: '96%', label: 'Satisfaction rate' }
  ];

  const categories = [
    { icon: '💻', name: 'Technology', count: '18,432 open roles' },
    { icon: '✏️', name: 'Design & Creative', count: '7,210 open roles' },
    { icon: '📊', name: 'Finance', count: '9,840 open roles' },
    { icon: '👨‍⚕️', name: 'Healthcare', count: '11,300 open roles' },
    { icon: '📣', name: 'Marketing', count: '5,670 open roles' },
    { icon: '⚙️', name: 'Engineering', count: '14,920 open roles' },
    { icon: '🏫', name: 'Education', count: '4,100 open roles' },
    { icon: '📋', name: 'Legal & Compliance', count: '3,580 open roles' }
  ];

  const featuredJobs = [
    {
      logo: 'A',
      bgColor: 'bg-purple-600',
      title: 'AI / ML Engineer',
      company: 'Anthropic',
      location: 'San Francisco · Remote OK',
      tags: ['Python', 'LLMs', 'PyTorch'],
      salary: '$180–240K',
      badge: 'Premium',
      badgeColor: 'bg-purple-600'
    },
    {
      logo: 'S',
      bgColor: 'bg-teal-600',
      title: 'Growth Manager',
      company: 'Shopify',
      location: 'Ottawa · Hybrid',
      tags: ['B2B', 'SEM', 'Analytics'],
      salary: '$85–105K',
      badge: 'New',
      badgeColor: 'bg-green-100 text-green-700'
    },
    {
      logo: 'F',
      bgColor: 'bg-indigo-600',
      title: 'DevOps Engineer',
      company: 'Figma',
      location: 'New York · Remote',
      tags: ['AWS', 'Kubernetes', 'CI/CD'],
      salary: '$130–160K',
      badge: 'Hot',
      badgeColor: 'bg-blue-100 text-blue-700'
    }
  ];

  const testimonials = [
    {
      stars: 5,
      text: '"Found my dream role as a UX lead in under two weeks. The job matching is impressively accurate — it actually read my profile."',
      name: 'Priya Rao',
      role: 'UX Lead · Dropbox',
      avatar: 'PR',
      bgColor: 'bg-indigo-600'
    },
    {
      stars: 5,
      text: '"As a recruiter, HireHub cuts my sourcing time in half. The quality of applicants is genuinely much higher than any platform I\'ve used before."',
      name: 'Marcus Kim',
      role: 'Talent Lead · Stripe',
      avatar: 'MK',
      bgColor: 'bg-blue-400',
      featured: true
    },
    {
      stars: 5,
      text: '"We posted our first listing and had 40+ qualified applicants in 3 days. The platform is clean, fast, and the team is super responsive."',
      name: 'Sara Chen',
      role: 'CEO · BuildFast',
      avatar: 'SC',
      bgColor: 'bg-green-600'
    }
  ];

  const heroJobs = [
    {
      company: 'Google',
      logo: 'G',
      bgColor: 'bg-blue-600',
      title: 'Product Designer',
      location: 'Mountain View',
      tags: ['Figma', 'UX Research', 'Remote OK'],
      salary: '$130–160K',
      featured: true
    },
    {
      company: 'Shopify',
      logo: 'S',
      bgColor: 'bg-teal-600',
      title: 'Full-Stack Engineer',
      location: 'Remote',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      salary: '$110–140K',
      featured: false
    },
    {
      company: 'Netflix',
      logo: 'N',
      bgColor: 'bg-purple-700',
      title: 'Data Scientist',
      location: 'Los Gatos',
      tags: ['Python', 'ML', 'Spark'],
      salary: '$160–200K',
      featured: false
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Trusted by 1.2M+ professionals
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-4 text-gray-900">
              Find the job you<br />were <em className="italic text-blue-600">meant</em> to do.
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-md">
              HireHub connects ambitious people with exceptional companies — whether you're searching for your first role, a bold career shift, or the right hire for your team.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={() => navigate('/signup')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition flex items-center justify-center gap-2">
                Browse Jobs →
              </button>
              <button onClick={() => navigate('/login')} className="px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-full hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7m10-3H6a2 2 0 0 0-2 2v2h14V6a2 2 0 0 0-2-2z" />
                </svg>
                Post a Job
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">PK</div>
                <div className="w-9 h-9 bg-cyan-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">MR</div>
                <div className="w-9 h-9 bg-green-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">SL</div>
                <div className="w-9 h-9 bg-amber-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">AT</div>
              </div>
              <p className="text-sm text-gray-600"><strong className="text-gray-900">40,000+</strong> people hired this month alone</p>
            </div>
          </div>

          {/* Right - Job Cards */}
          <div className="space-y-4">
            {heroJobs.map((job, i) => (
              <div key={i} className={`p-5 rounded-2xl border-2 transition hover:shadow-lg ${job.featured ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-25' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className={`w-12 h-12 ${job.bgColor} rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0`}>
                      {job.logo}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.company} · {job.location}</div>
                    </div>
                  </div>
                  {job.featured && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Featured</span>}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.tags.map((tag, j) => (
                    <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="font-bold text-gray-900">{job.salary} <span className="text-xs text-gray-500 font-normal">/ yr</span></div>
                  <button onClick={() => navigate('/signup')} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition font-semibold">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 py-8 px-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center border-r border-gray-700 last:border-r-0">
              <div className="text-4xl font-bold font-serif mb-2">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <section className="bg-gray-50 border-b border-gray-200 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Quick Search</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">Find your next opportunity</h2>
          </div>

          <div className="bg-white border border-gray-300 rounded-2xl p-2 flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
            <input type="text" placeholder="Job title, skill, or keyword..." className="flex-1 border-none outline-none bg-transparent text-gray-900" />
            <div className="w-px h-7 bg-gray-200"></div>
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="City or Remote" className="w-40 border-none outline-none bg-transparent text-gray-900" />
            <button onClick={() => navigate('/signup')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex-shrink-0">
              Search Jobs
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {['All Types', 'Remote', 'Full-time', 'Part-time', 'Freelance', 'Internship', 'Contract'].map((type, i) => (
              <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium transition ${i === 0 ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:border-blue-600'}`}>
                {type}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-600 font-medium">Popular:</p>
            {['UI/UX Designer', 'Software Engineer', 'Product Manager', 'Data Analyst', 'Marketing Lead'].map((tag, i) => (
              <button key={i} className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition font-semibold">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
      <div className="bg-gray-50 border-b border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-gray-600 font-medium uppercase tracking-widest mb-6">Trusted by top companies worldwide</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Google', 'Stripe', 'Notion', 'Figma', 'Shopify', 'Atlassian', 'Linear'].map((company, i) => (
              <div key={i} className="px-6 py-2 bg-white border border-gray-200 rounded-full font-bold text-gray-700">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section id="jobs" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Categories</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Explore by industry</h2>
            </div>
            <a href="#" className="text-blue-600 font-semibold text-sm hover:text-blue-700">Browse all →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {categories.map((cat, i) => (
              <div key={i} onClick={() => navigate('/signup')} className="p-6 border border-gray-200 rounded-2xl hover:bg-blue-600 hover:border-blue-600 hover:text-white transition cursor-pointer">
                <div className="text-2xl mb-3">{cat.icon}</div>
                <div className="font-bold text-gray-900 hover:text-white transition">{cat.name}</div>
                <div className="text-sm text-gray-600 hover:text-blue-100 transition">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Featured</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Trending this week</h2>
            </div>
            <a href="#" className="text-blue-600 font-semibold text-sm hover:text-blue-700">See all jobs →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredJobs.map((job, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${i === 0 ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'} hover:shadow-xl transition`}>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 ${i === 0 ? 'bg-indigo-600' : job.bgColor} rounded-xl flex items-center justify-center font-bold text-white`}>
                    {job.logo}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${job.badgeColor}`}>
                    {job.badge}
                  </span>
                </div>
                <h3 className={`font-bold text-lg mb-1 ${i === 0 ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                <p className={`text-sm mb-4 ${i === 0 ? 'text-gray-400' : 'text-gray-600'}`}>{job.company}</p>
                <p className={`text-xs mb-4 ${i === 0 ? 'text-gray-500' : 'text-gray-600'}`}>{job.location}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag, j) => (
                    <span key={j} className={`text-xs px-2 py-1 rounded ${i === 0 ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <span className={`font-bold ${i === 0 ? 'text-white' : 'text-gray-900'}`}>{job.salary}</span>
                  <button onClick={() => navigate('/signup')} className={`text-xs px-4 py-1.5 rounded-full font-bold transition ${i === 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Process</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">How HireHub works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Create your profile', desc: 'Build a rich profile showcasing your skills, work history, and portfolio. Let opportunities find you — even while you sleep.' },
              { num: 2, title: 'Get smart matches', desc: 'Our intelligent engine surfaces roles that fit your salary range, location preference, skills, and career goals — no noise.' },
              { num: 3, title: 'Apply & get hired', desc: 'One-click apply. Real-time application tracking. Interview scheduling. Land your next role faster than you thought possible.' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 border-4 border-white">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section id="employers" className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">For Employers</p>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4">Find the right talent,<br/>faster than ever.</h2>
            <p className="text-gray-600 mb-6">Post jobs, search verified talent, and manage your entire hiring pipeline — all in one clean, powerful dashboard.</p>

            <div className="space-y-4 mb-6">
              {[
                { icon: '🏆', title: 'Smart candidate matching', desc: 'AI-ranked applicants based on your exact requirements.' },
                { icon: '📊', title: 'Real-time analytics', desc: 'Track views, applications, and conversion at a glance.' },
                { icon: '⚡', title: 'One-click publishing', desc: 'Post to HireHub and 50+ partner job boards instantly.' }
              ].map((feat, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">{feat.icon}</span>
                  <div>
                    <div className="font-bold text-gray-900">{feat.title}</div>
                    <div className="text-sm text-gray-600">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/login')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition">
              Start Hiring Free →
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Top Applicants — Senior Designer</h3>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">24 new</span>
            </div>

            {[
              { initials: 'PR', name: 'Priya Rao', role: '5 yrs exp · Figma, UX', match: '98%', color: 'bg-indigo-600' },
              { initials: 'DK', name: 'Daniel Kim', role: '4 yrs exp · Webflow, UI', match: '94%', color: 'bg-cyan-600' },
              { initials: 'AL', name: 'Amara Lee', role: '6 yrs exp · Branding', match: '91%', color: 'bg-green-600' },
              { initials: 'JM', name: 'James Mora', role: '3 yrs exp · Motion', match: '87%', color: 'bg-purple-600' }
            ].map((applicant, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2 border border-gray-200">
                <div className={`w-9 h-9 ${applicant.color} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {applicant.initials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{applicant.name}</div>
                  <div className="text-xs text-gray-600">{applicant.role}</div>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                  {applicant.match} match
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Reviews</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">People love HireHub</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testi, i) => (
              <div key={i} className={`p-6 rounded-2xl ${testi.featured ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                <div className="mb-4 text-yellow-400">
                  {'★'.repeat(testi.stars)}
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${testi.featured ? 'text-blue-50' : 'text-gray-600'}`}>
                  {testi.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${testi.bgColor} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                    {testi.avatar}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${testi.featured ? 'text-white' : 'text-gray-900'}`}>{testi.name}</div>
                    <div className={`text-xs ${testi.featured ? 'text-blue-200' : 'text-gray-600'}`}>{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-12 bg-blue-600 rounded-3xl p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full opacity-10 -z-10"></div>

        <div className="max-w-2xl relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-3">Your next chapter<br/>starts right here.</h2>
          <p className="text-blue-100 mb-8">Join over 1.2 million professionals who found their next role — or their best hire — through HireHub. Free to get started.</p>

          <div className="flex gap-3">
            <button onClick={() => navigate('/signup')} className="px-6 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition">
              Find a Job
            </button>
            <button onClick={() => navigate('/login')} className="px-6 py-3 bg-transparent text-white border-2 border-blue-300 font-bold rounded-full hover:bg-blue-500 transition">
              Post a Job
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
              </div>
              HireHub
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Connecting people with opportunities since 2023. Every kind of job, every kind of talent.</p>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">For Job Seekers</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-white transition">Companies</a></li>
              <li><a href="#" className="hover:text-white transition">Salary Guide</a></li>
              <li><a href="#" className="hover:text-white transition">Career Advice</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">For Employers</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Post a Job</a></li>
              <li><a href="#" className="hover:text-white transition">Search Talent</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Recruiter Tools</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Company</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
          <p className="text-xs text-gray-500">© 2025 HireHub Inc. All rights reserved. · Privacy · Terms · Cookies</p>
          <div className="flex gap-2">
            {['x', 'linkedin'].map((social, i) => (
              <button key={i} className="w-8 h-8 border border-gray-700 rounded-lg hover:bg-gray-800 transition">
                <span className="text-xs">{social === 'x' ? '𝕏' : '🔗'}</span>
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
