import profileData from '@/data/profile.json'

const socialUrls = {
  GitHub: process.env.NEXT_PUBLIC_GITHUB_URL?.trim(),
  LinkedIn: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim(),
}

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()

const profile = {
  ...profileData,
  email: email || profileData.email,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || profileData.phone || '',
  socials: profileData.socials.map((social) => ({
    ...social,
    href: socialUrls[social.label] || social.href,
  })),
}

export default profile
