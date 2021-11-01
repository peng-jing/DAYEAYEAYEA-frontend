import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { adminCheck } from '../../webAPI/adminAPIs'
import styled from 'styled-components'
import Navbar from './Navbar'
import Footer from './Footer'

const Wrapper = styled.div`
  display: flex;
  height: calc(100vh - 24px);
`

const Container = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding: 6px 0 12px;
  position: relative;
`

const Layout = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const history = useHistory()
  useEffect(() => {
    ;(async () => {
      if (await adminCheck()) return setIsAdmin(true)

      setIsAdmin(false)
      alert('請先登入!!!')
      history.push('/admin/login')
    })()
  }, [history, children])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    history.push('/admin/login')
  }, [history])

  return (
    isAdmin && (
      <>
        <Wrapper>
          <Navbar handleLogout={handleLogout} />
          <Container>{children}</Container>
        </Wrapper>
        <Footer />
      </>
    )
  )
}

export default Layout
