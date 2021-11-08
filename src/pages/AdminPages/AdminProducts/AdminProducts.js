import styled from 'styled-components'
import qs from 'qs'
import { useState, useLayoutEffect, useCallback, useContext } from 'react'
import { useParams, useLocation, useHistory, Link } from 'react-router-dom'
import { LoadingContext, ModalContext, AdminContext } from '../../../context'
import { AdminIsLoadingComponent } from '../../../components/admin/AdminIsLoading'
import { ADMIN_MEDIA_QUERY, FONT_SIZE } from '../../../constants/style'
import {
  CategoryDropdown,
  Search
} from '../../../components/admin/productManage/Search'
import Table from '../../../components/admin/productManage/Table'
import { PaginatorButton } from '../../../components/admin/PaginatorStyle'
import { GeneralBtn } from '../../../components/Button'
import {
  getAllProducts,
  searchProductsFromAdmin,
  deleteProductById
} from '../../../webAPI/adminProductsAPI'
import { setAdminProductsPageInArray } from '../../../utils'
import {
  AdminDeleteModal,
  PermissionDeniedModal
} from '../../../components/admin/productManage/AdminProductModal'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 75vw;
  border: 1px solid transparent;
  margin: 40px auto;
  font-size: ${FONT_SIZE.sm};
  ${ADMIN_MEDIA_QUERY.md} {
    max-width: 1680px;
    font-size: ${FONT_SIZE.md};
  }
  ${ADMIN_MEDIA_QUERY.lg} {
    max-width: 1680px;
    font-size: ${FONT_SIZE.md};
  }
`
const SearchContainer = styled.div`
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const SearchSideContainer = styled.div`
  display: flex;
`
const PaginatorDiv = styled.div`
  margin: 20px auto;
`

const SearchResultDiv = styled.div`
  display: flex;
  height: 300px;
  align-items: center;
  justify-content: center;
`

function CancelButton({ onCancelClick }) {
  return (
    <GeneralBtn
      color='admin_blue'
      buttonStyle={{ marginLeft: '8px' }}
      onClick={onCancelClick}
    >
      取消
    </GeneralBtn>
  )
}

function DeleteButton({ onDeleteClick }) {
  return (
    <GeneralBtn color='admin_grey' onClick={onDeleteClick}>
      刪除
    </GeneralBtn>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { isLoading, setIsLoading } = useContext(LoadingContext)
  const { isModalOpen, setIsModalOpen, handleModalClose, productId } =
    useContext(ModalContext)
  const { isSuperAdmin } = useContext(AdminContext)
  const { page = 1 } = useParams()
  const keywords = useLocation().search.trim(' ')
  const keywordString = qs.parse(keywords, { ignoreQueryPrefix: true }).search
  const history = useHistory()
  const location = useLocation()
  const productsPerPage = 12
  const perPageSliceStart = (Number(page) - 1) * productsPerPage
  const perPageSliceEnd = Number(page) * productsPerPage
  let showProductsList
  let pagesArray
  let totalPage
  let showProductsByPage

  useLayoutEffect(() => {
    setIsLoading(true)
    if (keywords) {
      searchProductsFromAdmin(keywords).then((result) => {
        if (!result) return setIsLoading((isLoading) => true)
        if (result.ok === 0) {
          return history.push('/admin/404')
        }
        setIsLoading(false)
        setProducts(result.data)
      })
    }
    if (!keywords) {
      getAllProducts().then((result) => {
        if (!result) return setIsLoading((isLoading) => true)
        if (result.ok === 0) {
          return history.push('/admin/404')
        }
        setIsLoading(false)
        setProducts(result.data)
      })
    }
  }, [keywords, history, setIsLoading])

  if (products) {
    showProductsList = products.filter((product) =>
      categoryFilter === 'all' ? product : product.category === categoryFilter
    )
    pagesArray = setAdminProductsPageInArray(showProductsList.length).pagesArray
    totalPage = setAdminProductsPageInArray(showProductsList.length).totalPage
    showProductsByPage = showProductsList.slice(
      perPageSliceStart,
      perPageSliceEnd
    )
  }

  if (totalPage) {
    parseInt(page) > totalPage && history.push('/admin/404')
  }

  const handelOnClick = useCallback(() => {
    setIsModalOpen(true)
  }, [setIsModalOpen])

  const handleDropDownChange = useCallback(
    (e) => {
      setCategoryFilter((categoryFilter) => e.target.value)
      if (keywords) {
        history.push('/admin/products/1')
      }
      if (location.pathname !== '/admin/products/1')
        history.push('/admin/products/1')
    },
    [history, location, keywords]
  )

  const handleDelete = useCallback(() => {
    deleteProductById(productId).then((result) => {
      if (!result) return
      if (result.ok === 0) return alert(result.message)
      const deletedProductsList = products.filter(
        (product) => product.id !== productId
      )
      setProducts((products) => deletedProductsList)
      if ((showProductsByPage.length - 1) % productsPerPage === 0) {
        history.push(`/admin/products/${totalPage - 1}`)
      }
      handleModalClose()
    })
  }, [
    productId,
    products,
    handleModalClose,
    totalPage,
    history,
    showProductsByPage
  ])

  return (
    <PageWrapper>
      {isLoading && <AdminIsLoadingComponent />}
      {isSuperAdmin ? (
        <AdminDeleteModal
          open={isModalOpen}
          onClose={handleModalClose}
          buttonOne={<DeleteButton onDeleteClick={handleDelete} />}
          buttonTwo={<CancelButton onCancelClick={handleModalClose} />}
        />
      ) : (
        <PermissionDeniedModal open={isModalOpen} onClose={handleModalClose} />
      )}
      <SearchContainer>
        <SearchSideContainer>
          <Search />
          <CategoryDropdown onChange={handleDropDownChange} />
        </SearchSideContainer>
        <SearchSideContainer>
          {isSuperAdmin ? (
            <Link style={{ width: '100px' }} to={'/admin/products/add'}>
              <GeneralBtn color='admin_blue'>新增商品</GeneralBtn>
            </Link>
          ) : (
            <GeneralBtn
              buttonStyle={{ width: '100px' }}
              color='admin_blue'
              onClick={handelOnClick}
            >
              新增商品
            </GeneralBtn>
          )}
        </SearchSideContainer>
      </SearchContainer>
      {keywords && products.length === 0 ? (
        <SearchResultDiv>{`您搜尋的關鍵字「${keywordString}」，沒有找到符合的商品`}</SearchResultDiv>
      ) : (
        <Table products={showProductsByPage} />
      )}
      <PaginatorDiv>
        {pagesArray &&
          pagesArray.map((pageValue) => {
            return (
              <PaginatorButton
                key={pageValue}
                page={pageValue}
                to={`/admin/products/${pageValue}`}
                active={pageValue === parseInt(page)}
              ></PaginatorButton>
            )
          })}
      </PaginatorDiv>
    </PageWrapper>
  )
}
