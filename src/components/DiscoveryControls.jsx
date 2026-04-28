import { useState, useEffect } from 'react'
import { apiRequest } from '../services/api.js'
import IconButton from './IconButton.jsx'
import { X, Bookmark } from 'lucide-react'

/**
 *
 
 * @param root0
 * @param root0.interaction
 */
export default function DiscoveryControls ({ interaction }) {
  return (
    <div className='flex gap-8'>
      <IconButton onClick={() => interaction('skipped')} icon={X} backgroundColor='bg-red-500/10' borderColor='border-red-500/25' textColor='text-red-500' />
      <IconButton onClick={() => interaction('saved')} icon={Bookmark} backgroundColor='bg-yellow-500/10' borderColor='border-yellow-500/25' textColor='text-yellow-500' />
    </div>
  )
}
