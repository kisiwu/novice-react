import { useEffect } from 'react';
import { Link } from 'react-router';

export default function IndexPage() {

  useEffect(() => {
    console.log('IndexPage')
  }, [])

  return (
    <div id="index-page" className='dark:text-gray-400'>
      <h1>INDEX PAGE</h1>
      <div>
        <Link to='info'>open info</Link>
      </div>
      <div>
        <Link to='d'>open fake</Link>
      </div>
    </div>
  );
}