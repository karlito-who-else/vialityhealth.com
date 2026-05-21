import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { LoginForm } from '@/components/forms/LoginForm'
import { redirect } from 'next/navigation'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const settings = await getCachedGlobal('settings', 1)()

  const alreadyLoggedInWarning = settings?.alreadyLoggedInWarning || 'You are already logged in.'
  const loginHeading = settings?.loginHeading || 'Log in'
  const loginDescription = settings?.loginDescription || ''

  if (user) {
    redirect(`/account?warning=${encodeURIComponent(alreadyLoggedInWarning)}`)
  }

  return (
    <div className="container">
      <div className="max-w-xl mx-auto my-12">
        <RenderParams />

        <h1 className="mb-4 text-[1.8rem]">{loginHeading}</h1>
        {loginDescription && (
          <p className="mb-8">
            {loginDescription}
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal('settings', 1)()

  return {
    description: settings?.loginDescription || 'Login or create an account to get started.',
    openGraph: {
      title: settings?.loginHeading || 'Login',
      url: '/login',
    },
    title: settings?.loginHeading || 'Login',
  }
}
