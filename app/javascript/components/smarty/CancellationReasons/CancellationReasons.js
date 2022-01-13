import React, { useState, useEffect, useCallback } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import {
  Card,
  Layout,
  TextField,
  SkeletonDisplayText,
  Button,
  Stack,
} from '@shopify/polaris';
import dayjs from 'dayjs';
import Pagination from '../../common/Pagination';
import TableSkeleton from '../../common/TableSkeleton';

const CancellationReasons = ({ handleEditCancellation }) => {
  const fetchQuery = gql`
    query ($offsetAttributes: OffsetAttributes!, $searchKey: String) {
      fetchSmartyCancellationReasons(
        offsetAttributes: $offsetAttributes
        searchKey: $searchKey
      ) {
        totalCount
        cancellationReasons {
          id
          winback
          name
          updatedAt
        }
      }
    }
  `;
  const deleteQuery = gql`
    mutation ($input: DeleteSmartyCancellationInput!) {
      deleteSmartyCancellation(input: $input) {
        smartyCancellationReason {
          id
          name
          winback
        }
      }
    }
  `;
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    searchValue: '',
    limit: 25,
    offset: 0,
  });
  const [getCancelReasons, { loading, data, error }] = useLazyQuery(
    fetchQuery,
    { fetchPolicy: 'cache-and-network' }
  );
  const [deleteCancelReasons] = useMutation(deleteQuery);

  useEffect(() => {
    getCancelReasons({
      variables: {
        offsetAttributes: { limit: filters.limit, offset: filters.offset },
        searchKey: filters.searchValue,
      },
    });
  }, [filters]);

  const count = data?.fetchSmartyCancellationReasons?.totalCount;
  const totalPages = Math.ceil(count / filters.limit);

  const handlePageClick = useCallback(
    (data) => {
      let selected = data && data.selected;
      let _offset = Math.ceil(selected * filters.limit);
      setFilters({ ...filters, offset: _offset });
    },
    [setFilters, filters.limit]
  );

  const getWinbackClass = (winback) => {
    switch (winback) {
      case 'skip':
        return 'skip-order';
      case 'not_defined':
        return 'not-defined';
      case 'swap' || 'swap-product':
        return 'swap-product';
    }
  };

  const getWinbackFull = (winback) => {
    switch (winback) {
      case 'skip':
        return 'skip order';
      case 'not_defined':
        return 'not defined';
      case 'swap' || 'swap-product':
        return 'swap product';
    }
  };

  const handleDelete = (id) => {
    if (id) {
      deleteCancelReasons({
        variables: {
          input: {
            id: id,
          },
        },
      }).then((res) => {
        if (res.data) {
          getCancelReasons({
            variables: {
              offsetAttributes: {
                limit: filters.limit,
                offset: filters.offset,
              },
              searchKey: filters.searchValue,
            },
          });
        }
      });
    }
  };

  return (
    <Layout>
      <Card>
        <Card.Section>
          <div className="smarty-sms">
            <div className="cancel-reason-header">
              <p className="customize-text">Message Custom Keywords</p>
              <button
                className="cancelation-reason"
                onClick={() => handleEditCancellation('')}
              >
                + Add New Cancellation Reason
              </button>
            </div>
            <p className="customize-text" style={{ fontWeight: 'normal' }}>
              Add your own responses to customer messages.
            </p>

            <form class="">
              <div className="message-form">
                <div class="example">
                  <TextField
                    placeholder="Message’s Title"
                    value={searchValue}
                    onChange={(value) => setSearchValue(value)}
                  />
                  <Button
                    primary
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters({ ...filters, searchValue: searchValue });
                    }}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>

            <table className="message-table">
              <tr>
                <th>Name</th>
                <th>Winback</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
              {loading && <TableSkeleton rows={5} cols={4} />}
              {!loading && data && (
                <>
                  {data.fetchSmartyCancellationReasons.cancellationReasons.map(
                    (reason) => (
                      <tr>
                        <td>{reason.name}</td>
                        <td>
                          <button
                            className={`${getWinbackClass(
                              reason.winback
                            )} upper`}
                          >
                            {getWinbackFull(reason.winback)}
                          </button>
                        </td>
                        <td>
                          {dayjs(reason.updatedAt).format('DD MMM HH:mm')}
                        </td>
                        <td>
                          <Stack>
                            <Button
                              primary
                              onClick={() => handleEditCancellation(reason.id)}
                            >
                              Edit
                            </Button>
                            <div style={{ color: '#bf0711' }}>
                              <Button
                                monochrome
                                outline
                                onClick={() => handleDelete(reason.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </Stack>
                        </td>
                      </tr>
                    )
                  )}
                </>
              )}
            </table>
            <div className="message-pagination">
              {data && count > filters.limit && (
                <Pagination
                  handlePageClick={handlePageClick}
                  offset={filters.offset}
                  limit={filters.limit}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
        </Card.Section>
      </Card>
    </Layout>
  );
};

export default CancellationReasons;
