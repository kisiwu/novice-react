import { usePanelManager } from '@/hooks/usePanelManager';
import { useEffect } from 'react';
import { Link } from 'react-router';

export default function IndexPage({ currentPath }) {

  const { panelingType } = usePanelManager()

  useEffect(() => {
    console.log('IndexPage')
  }, [])

  return (
    <div id="index-page" className='xl:col-span-3'>
      <h1 className='text-2xl font-extrabold'>{panelingType?.toUpperCase()}</h1>
      <h2 className='text-xl font-semibold'>INDEX PAGE</h2>
      <h3 className='text-lg'>current path: {currentPath}</h3>
      <div>
        <Link to='info'>open info</Link>
      </div>
      <div>
        <Link to='d'>open fake</Link>
      </div>
    </div>
  );
}