import styled from 'styled-components'
import { useState, useEffect, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { MEDIA_QUERY } from '../../constants/style'
import { LoadingContext, ModalContext } from '../../context'
import { IsLoadingComponent } from '../../components/IsLoading'
import { ProductImgsComponent } from './ProductImg'
import { ProductUpInfoComponent } from './ProductUpInfo'
import { ProductBottomInfoComponent } from './ProductBottomInfo'
import { PageWidth } from '../../components/general'
import { getProductById } from '../../webAPI/productsAPI'
import { FullModal } from '../../components/Modal'

const ProductPageDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ProductTopContainer = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px auto;

  ${MEDIA_QUERY.tablet} {
    height: 365px;
    flex-direction: row;
    justify-content: center;
    margin: 60px auto 20px auto;
  }

  ${MEDIA_QUERY.desktop} {
    height: 380px;
    flex-direction: row;
    justify-content: center;
    margin: 40px auto;
  }
`

export default function Products() {
  const [product, setProduct] = useState([])
  const [productImgs, setProductImgs] = useState([])
  const { isLoading, setIsLoading } = useContext(LoadingContext)
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext)
  const { id } = useParams()

  useEffect(() => {
    setIsLoading((isLoading) => true)
    getProductById(id).then((result) => {
      if (result.ok === 0) return setIsLoading((isLoading) => false)
      setProduct(result.data)
      setProductImgs(result.data.Product_imgs)
      setIsLoading((isLoading) => false)
    })
  }, [setIsLoading, id])

  const handleModalClose = useCallback(() => {
    setIsModalOpen((isModalOpen) => false)
  }, [setIsModalOpen])

  const { name, shortDesc, longDesc, price, discountPrice, quantity } = product
  let hasDiscount = price !== discountPrice ? true : false

  return (
    <PageWidth>
      {isLoading && <IsLoadingComponent />}
      <FullModal
        open={isModalOpen}
        content='已成功加入購物車 ! '
        onClose={handleModalClose}
      />
      <ProductPageDiv>
        <ProductTopContainer>
          <ProductImgsComponent imgs={productImgs} />
          <ProductUpInfoComponent
            id={id}
            name={name}
            shortDesc={shortDesc}
            imgs={productImgs}
            price={price}
            discountPrice={discountPrice}
            hasDiscount={hasDiscount}
            totalQuantity={quantity}
          />
        </ProductTopContainer>
        <ProductBottomInfoComponent longDesc={longDesc} />
      </ProductPageDiv>
    </PageWidth>
  )
}
