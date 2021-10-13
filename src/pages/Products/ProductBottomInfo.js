import styled from 'styled-components'
import { COLOR, FONT_SIZE, MEDIA_QUERY } from '../../constants/style'

const ProductBottomContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  ${MEDIA_QUERY.tablet} {
    width: 100%;
  }
  ${MEDIA_QUERY.desktop} {
    width: 80%;
  }
`

const Title = styled.div`
  font-size: ${FONT_SIZE.lg};
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${MEDIA_QUERY.tablet} {
    font-size: ${FONT_SIZE.xl};
  }
  ${MEDIA_QUERY.desktop} {
    font-size: ${FONT_SIZE.xl};
  }
`

const TitleBorder = styled.div`
  margin-top: 8px;
  width: 25%;
  border-bottom: 3px solid ${COLOR.primary_dark};
  ${MEDIA_QUERY.tablet} {
    width: 10%;
  }
  ${MEDIA_QUERY.desktop} {
    width: 5%;
  }
`

const LongDescContent = styled.div`
  margin: 20px auto;
  width: 80%;
  text-align: left;
  white-space: pre-wrap;
  line-height: 1.5em;
  ${MEDIA_QUERY.tablet} {
    line-height: 2em;
  }
  ${MEDIA_QUERY.desktop} {
    line-height: 2em;
  }
`
export function ProductBottomInfoComponent({ longDesc }) {
  return (
    <ProductBottomContainer>
      <Title>
        商品敘述
        <TitleBorder />
      </Title>
      <LongDescContent>{longDesc}</LongDescContent>
    </ProductBottomContainer>
  )
}