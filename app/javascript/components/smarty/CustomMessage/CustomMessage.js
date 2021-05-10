import React, { useState,useEffect, useCallback, useMemo} from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import {
  Card,
  Layout,
  Select,
  TextField,
  SkeletonDisplayText,
  Button
} from '@shopify/polaris';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';
import Pagination from '../../common/Pagination';
import { useHistory } from 'react-router';
import TableSkeleton from '../../common/TableSkeleton';


const CustomMessage = () => {
    const fetchQuery=gql`
    query ($offsetAttributes: OffsetAttributes!, $custom: String, $searchKey: String, $sortColumn: String, $sortDirection: String) {
      fetchSmartyMessages(offsetAttributes: $offsetAttributes, custom: $custom, searchKey: $searchKey, sortColumn: $sortColumn, sortDirection: $sortDirection) {
              totalCount
              smartyMessages {
                  id
                  title
                  description
                  body
                  updatedAt
              }
      }
  }
    `

    const orderOptions = [
        { label: "Order By Title", value: 'title' },
        { label: "Last Modified", value: 'updated_at' }
    ]
  const history=useHistory()
  const [searchValue, setSearchValue] = useState("");
  const [filters,setFilters]=useState({searchValue:"",order:"updated_at",type:"DESC",limit:5,offset:0})

  const [getMessages, { loading, data, error }] = useLazyQuery(fetchQuery,{fetchPolicy:"cache-and-network"});

  useEffect(() => {
   getMessages({
     variables:{
       offsetAttributes:{limit:filters.limit,offset:filters.offset},
       custom:"true",
       searchKey:filters.searchValue,
       sortColumn:filters.order,
       sortDirection:filters.type
     }
   })
  }, [filters])

  const count =data?.fetchSmartyMessages?.totalCount;
  const totalPages=Math.ceil(count / filters.limit);

  const handlePageClick = useCallback(data => {
    let selected = data && data.selected;
    let _offset = Math.ceil(selected * filters.limit);
    setFilters({...filters,offset:_offset});
  }, [setFilters, filters.limit])

    return (
      <Layout>
        <Card>
          <Card.Section>
            <div className="smarty-sms">
                <p className="customize-text">Custom Messages</p>
                <p className="customize-text" style={{ fontWeight: 'normal' }}>Customize your SMS Messages</p>
                <form class="">
                    <div className="message-form">
                        <div class="example">
                        <TextField
                    placeholder="Message’s Title"
                    value={searchValue}
                    onChange={(value) => setSearchValue(value)}
                  />
                  <Button primary onClick={(e)=>{e.stopPropagation();setFilters({...filters,searchValue:searchValue});}} >Search</Button>
                        </div>
                        <div class="Polaris-Select order-title">
                            <Select
                                options={orderOptions}
                                value={filters.order}
                                onChange={(value) => setFilters({...filters,order:value})}
                            />
                        </div>

                    </div>
                </form>

                <table className="message-table">
                    <tr>
                        <th>Name</th>
                        <th>Last Modified</th>
                        <th style={{ width: '27%' }}>Actions</th>
                    </tr>
                        {
                         loading && <TableSkeleton rows={5} cols={3} />
                        }
              {
                (!loading && data) && data?.fetchSmartyMessages?.smartyMessages?.map(msg => (
                  <tr>
                    <td>{msg.title}</td>
                    <td>{dayjs(msg.updatedAt).format("DD MMM HH:mm")}</td>
                    <td onClick={() => history.push(`/edit-smarty-message/${msg.id}`,{tabIndex:1})}>
                      <div className="edit-btn cursor-pointer">
                        <span >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.9697 8.85494C13.6535 8.85494 13.3972 9.11123 13.3972 9.42746V13.855H1.14528V1.60305H5.57277C5.889 1.60305 6.14529 1.34676 6.14529 1.03053C6.14529 0.714297 5.889 0.458008 5.57277 0.458008H0.572764C0.256533 0.458008 0.000244141 0.714297 0.000244141 1.03053V14.4275C0.000244141 14.7437 0.256563 15 0.572764 15H13.9697C14.2859 15 14.5422 14.7437 14.5422 14.4275V9.42746C14.5422 9.11126 14.2859 8.85494 13.9697 8.85494Z" fill="#007EFF" /> <path d="M14.8322 2.20975L12.7905 0.167754C12.6832 0.060293 12.5376 0 12.3857 0C12.2338 0 12.0884 0.060293 11.9809 0.167754L5.22518 6.92347C5.15572 6.99275 5.10553 7.07862 5.07881 7.1729L4.27728 10.0164C4.22118 10.2158 4.2771 10.43 4.42365 10.5766C4.53243 10.6853 4.67862 10.7443 4.82841 10.7443C4.88012 10.7443 4.93242 10.7372 4.98357 10.7229L7.82709 9.92139C7.92155 9.89467 8.00745 9.84428 8.0767 9.77502L14.8322 3.01931C15.0559 2.7958 15.0559 2.43319 14.8322 2.20975ZM7.37288 8.85973L5.65666 9.3433L6.14044 7.62747L12.3857 1.38226L13.6179 2.61451L7.37288 8.85973Z" fill="#007EFF" /> <path d="M6.05331 6.90348L5.24365 7.71313L7.28532 9.7548L8.09497 8.94515L6.05331 6.90348Z" fill="#007EFF" /> </svg>
                        Edit
                          </span>
                      </div>
                      {/* <div className="duplicate-btn">
                        <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          < path d="M12.2416 3.2983L9.07687 0.133553C8.99012 0.0468063 8.87328 0 8.75403 0H4.17376C3.92188 0 3.71737 0.204506 3.71737 0.45639V3.07686H1.09702C0.845131 3.07686 0.640625 3.28125 0.640625 3.53325V14.5436C0.640625 14.7955 0.845131 15 1.09702 15H8.84192C9.09392 15 9.29842 14.7955 9.29842 14.5436V11.9231H11.9188C12.1707 11.9231 12.3752 11.7188 12.3752 11.4668V3.62114C12.3752 3.5051 12.3305 3.38722 12.2416 3.2983ZM11.4624 11.0104H9.29842V6.698C9.29842 6.57978 9.25242 6.46271 9.16476 6.37505L6.00012 3.21041C5.91418 3.12435 5.79756 3.07674 5.67728 3.07674H4.63026V0.912781H8.29764V3.62114C8.29764 3.87302 8.50214 4.07753 8.75403 4.07753H11.4624V11.0104ZM8.38553 14.0872H1.55341V3.98964H5.22078V6.698C5.22078 6.94988 5.42529 7.15439 5.67728 7.15439H8.38553V14.0872ZM6.13367 4.63497L7.7402 6.24149H6.13367V4.63497ZM10.8169 3.16475H9.21042V1.55823C9.41126 1.75896 10.6567 3.00453 10.8169 3.16475Z" fill="#007EFF" />
                        </svg>
                      Duplicate
                    </div> */}
                    </td>
                  </tr>
                ))
              }
                </table>
            <div className="message-pagination">
            {
              (data && count>filters.limit) &&
                <Pagination 
                handlePageClick={handlePageClick}
                offset={filters.offset}
                limit={filters.limit}
                totalPages={totalPages}
                />
            }
            </div>
            </div>

          </Card.Section>
        </Card>
      </Layout>
    )
}

export default CustomMessage
