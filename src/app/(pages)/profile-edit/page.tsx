import { Footer, Navbar } from '@/src/components/layout'
import React from 'react'
import ProfileEditView from './sections/profile-edit-view'

export default function ProfileEdit() {
  return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <ProfileEditView />
        <Footer />
      </div>
  )
}
