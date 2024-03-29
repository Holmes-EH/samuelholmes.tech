import { useState, useEffect } from 'react';
import SHLogo from '../images/sh-on.svg';
import Link from 'next/link';

const Header = () => {
  const [show, setShow] = useState(false);
  const [slideUp, setSlideUp] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const display = () => {
      setShow(!show);
      setFirstLoad(!firstLoad);
      setSlideUp(false);
    };
    if (firstLoad) {
      setTimeout(function () {
        display();
      }, 4500);
    } else {
      setSlideUp(!slideUp);
      display();
    }
  }, [show, firstLoad, slideUp]);

  const slideUpClass = slideUp ? ' slideUp' : '';

  return (
    <header className={`row ${slideUpClass}`}>
      <Link href='/' style={{ display: 'block', margin: '0 auto' }}>
        <div className='logoContainer'>
          <div className='topLeftText'>
            <h1>
              <span className='samuel'>Samuel</span>
            </h1>
            <h1>
              <span className='holmes'>Holmes</span>
            </h1>
          </div>
          <SHLogo className='topLogo' />
          <div className='topRightText'>
            <h1>
              <span className='T'>T</span>
              <span className='E'>E</span>
              <span className='C'>C</span>
              <span className='H'>H</span>
            </h1>
          </div>
        </div>
      </Link>
    </header>
  );
};

export default Header;
