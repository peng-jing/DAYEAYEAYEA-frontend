import { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useHistory, useParams } from 'react-router'
import styled from 'styled-components'
import { COLOR, MEDIA_QUERY, FONT_SIZE } from '../../../constants/style'
import { UserContext } from '../../../context'
import { Tabs } from '../../../components/Tab'
import { PageWidth } from '../../../components/general'
import { IsLoadingComponent as Loading } from '../../../components/IsLoading'
import Home from '../Home'
import Orders from '../Orders'
import Info from '../Info'
import useAxios from '../../../hooks/useAxios'
import useFetch from '../../../hooks/useFetch'


const PageWidthHeight = styled(PageWidth)`
  min-height: 600px;
`
const Container = styled.div`
  margin: 60px auto 0;
  width: 80%;
  min-width: 350px;
`
const Title = styled.div`
  font-size: ${FONT_SIZE.lg};
  margin-top: 30px;
  font-weight: bold;
`

const Wrapper = styled.div`
  margin: 30px auto;
  min-height: 400px;
  border: 1px solid ${COLOR.border_light_grey};
  ${MEDIA_QUERY.tablet} {
    transform: translateY(5%);
  }
`

export default function MeTab() {
  const { setUser } = useContext(UserContext)
  const [{ data = {}, loading: isLoading, error }, refetch] = useAxios('/members/me')
  // const { isLoading, response, error, refetch} = useFetch('https://api.coolizz.tw/members/me')
  const history = useHistory()
  const { tab } = useParams()
  const tabIndex = useMemo(() => {
    const urlMapping = {
      orders: 1,
      info: 2
    }
    return urlMapping[tab] || 0
  }, [tab])
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
    history.push('/')
  }, [history, setUser])

  console.log(data, isLoading, error)
  // useEffect(() => refetch(), [history.location, refetch])


  return (
    <PageWidthHeight>
      { isLoading && <Loading /> }
      <Container>
        <Title>會員專區</Title>
        <Wrapper>
          <Tabs
            tabs={['會員首頁', '訂單紀錄', '會員資料']}
            tabsPanel={[
              <Home profile={data.data} logout={logout} />,
              <Orders orders={data.data?.Orders} />,
              <Info profile={data.data} />
            ]}
            presetTab={0}
            changeTab={tabIndex}
          />
        </Wrapper>
      </Container>
    </PageWidthHeight>
  )
}
