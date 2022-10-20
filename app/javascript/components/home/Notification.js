import React, { useState, useCallback, useEffect, useLayoutEffect } from "react";
import {
  AppProvider,
  Card,
  Button,
  Popover,
  Spinner
} from "@shopify/polaris";
import InfiniteScroll from 'react-infinite-scroll-component';
import { gql, useLazyQuery } from '@apollo/client';
import _, { isEmpty } from "lodash";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import LoadingScreen from "../LoadingScreen";
import dayjs from "dayjs";

TimeAgo.addDefaultLocale(en);
const Notification = () => {

  const timeAgo = new TimeAgo('en-US');


  const notificationQuery = gql`
    query($page: String!) {
      fetchSubscriptionLogs(page: $page){
          subscriptionLogs
          {
              id
              actionType
              createdAt
              description
              note
              amount
              event
              customerName
          }
          totalCount
          totalPages
          pageNumber
      }
    }
  `;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [rendered, setRendered] = useState(false);
  const [feeds, setFeeds] = useState([])
  const [fetchNotifications, { loading, data: notifications, error }] = useLazyQuery(notificationQuery, { fetchPolicy: "network-only" });

  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => {
      if (!popoverActive) {
        setRendered(true);
        setFeeds([]);
        setPage(1);
        fetchNotifications({
          variables: {
            page: page.toString()
          }
        });
      } else {
        setPage(1);
      }
      setPopoverActive((popoverActive) => !popoverActive);
    },
    [],
  );

  useEffect(() => {
    if (rendered && totalPages <= page && popoverActive && page != 1) {
      fetchNotifications({
        variables: {
          page: page.toString()
        }
      });
    }
  }, [page]);


  const fetchMoreData = () => {
    const nextPage = page + 1;
    if (nextPage > totalPages) {
      setHasMore(false);
    } else
      setPage(nextPage);
  }

  useEffect(() => {
    if (notifications?.fetchSubscriptionLogs?.totalPages) {
      let pages = parseInt(notifications?.fetchSubscriptionLogs?.totalPages);
      pages > 1 && setHasMore(true);
      setTotalPages(parseInt(notifications?.fetchSubscriptionLogs?.totalPages))
      setFeeds([...feeds, ...notifications?.fetchSubscriptionLogs?.subscriptionLogs])
    }
  }, [notifications])

  useEffect(() => {
    if (!popoverActive) {
      setFeeds([]);
      setPage(0);
      setHasMore(false);
      setTotalPages(0);
    }

  }, [popoverActive])

  const icon = (text) => (
    <span style={{ display: "flex" }}>
      <span style={{ marginRight: "5px" }}>{text}</span>
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="18.0645" height="18.0645" rx="9.03226" fill="white" />
        <rect x="12" y="0.0645142" width="4.83871" height="4.83871" rx="2.41935" fill="#FF0000" />
        <path d="M9.03217 13.3332C9.50529 13.3332 9.89238 12.9461 9.89238 12.473H8.17195C8.17195 12.7011 8.26258 12.9199 8.42391 13.0813C8.58523 13.2426 8.80403 13.3332 9.03217 13.3332ZM11.6128 10.7526V8.60202C11.6128 7.28159 10.9074 6.17621 9.67733 5.88374V5.59127C9.67733 5.23428 9.38916 4.94611 9.03217 4.94611C8.67518 4.94611 8.38701 5.23428 8.38701 5.59127V5.88374C7.1526 6.17621 6.45152 7.27729 6.45152 8.60202V10.7526L5.59131 11.6128V12.0429H12.473V11.6128L11.6128 10.7526Z" fill="#000000" />
      </svg>
    </span>
  )
  const activator = (
    <div>
      <Button primary onClick={togglePopoverActive} >
        {icon("Revenue Live Feed")}
      </Button>
    </div>
  );

  const mapAction = {
    "opt-in": "new",
    "skip": "skip",
    "cancel": "cancelled",
    "swap": "swap",
    "restart": "restart",
    "upgrade": "upgrade",
    "downgrade": "downgrade",
    "meal_selection": "meal selection",
    "pause": "pause"
  }

  const getColor = (action) => {
    switch (action) {
      case "opt-in":
        return "green";
        break;
      case "skip":
        return "blue";
        break;
      case "cancel":
        return "red";
        break;
      case "upgrade":
        return "blue";
        break;
      case "downgrade":
        return "blue";
        break;
      case "swap":
        return "blue";
        break;
      case "restart":
        return "green";
        break;
      default:
        return "blue"
    }
  }

  return (
    <>
      <>
        <div className="popover-wrapper">
          <Popover
            active={popoverActive}
            activator={activator}
            onClose={togglePopoverActive}
            fluidContent={true}
            fullWidth={true}
          >
            <>
              <Card title="Live Notifications" sectioned>
                {
                  (loading && isEmpty(feeds)) ?
                    <LoadingScreen /> :
                    <>
                      {
                        !isEmpty(feeds) && rendered &&
                        <>
                          <div id="scrollableDiv" style={{ overflow: "auto", maxHeight: "450px", overscrollBehavior: "none" }}>
                            <InfiniteScroll
                              dataLength={feeds.length}
                              next={fetchMoreData}
                              hasMore={hasMore}
                              scrollableTarget="scrollableDiv"
                              loader={loading &&
                                <div className="notification-wrapper">
                                  <Card>
                                    <LoadingScreen />
                                  </Card>
                                </div>

                              }
                            >
                              <>
                                {
                                  !isEmpty(feeds) && feeds?.map(notification => (
                                    <div className="notification-wrapper">
                                      <Card>
                                        <div className="content-notification-wrapper">
                                          <div className="conent-inner-wrapper">
                                            <div className={`content-color-${getColor(notification?.actionType)}`}></div>
                                            <div className={"main-content"}>
                                              <div className="main-0">Customer :- {_.capitalize(notification?.customerName)}</div>
                                              <div className="main-1">
                                                <p><strong>{notification?.description?.split(",")[0] || ' '}</strong> <small>{notification?.description?.split(",")[1] || ' '}</small> <strong>{notification?.description?.split(",")[2] || ' '}</strong></p>
                                              </div>
                                              <div className="main-2">
                                                <p className={`status ${getColor(notification?.actionType)}`}>{_.capitalize(mapAction[notification?.actionType]) || ' '}</p>
                                                <div className="icon-wrapper">
                                                  <span>
                                                    <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M20.786 7.02876C20.824 6.75225 20.8071 6.47095 20.7361 6.20102C20.6651 5.93108 20.5415 5.67782 20.3724 5.45576C20.2033 5.23371 19.992 5.04723 19.7507 4.90703C19.5094 4.76682 19.2427 4.67566 18.966 4.63876C18.6895 4.59923 18.4079 4.61605 18.1381 4.68823C17.8683 4.76041 17.6158 4.88646 17.396 5.05876C16.9479 5.39824 16.6529 5.90182 16.576 6.45875C16.5365 6.73525 16.5533 7.0169 16.6255 7.28671C16.6977 7.55653 16.8237 7.80894 16.996 8.02876C17.1884 8.29275 17.4424 8.50562 17.736 8.64876C17.9441 8.74986 18.1668 8.81738 18.396 8.84877C18.6718 8.88798 18.9527 8.87192 19.2222 8.80153C19.4918 8.73114 19.7446 8.60783 19.966 8.43877C20.1941 8.27455 20.385 8.0641 20.5263 7.82115C20.6676 7.5782 20.7561 7.30821 20.786 7.02876Z" fill="#1D5BAA" />
                                                      <path d="M18.9961 4.61874C18.7196 4.57921 18.438 4.59604 18.1682 4.66822C17.8983 4.7404 17.6459 4.86643 17.4261 5.03874C16.9779 5.37821 16.683 5.88181 16.6061 6.43875C16.5596 6.71637 16.5702 7.00055 16.6372 7.27394C16.7043 7.54732 16.8264 7.80416 16.9961 8.02874C17.1884 8.29273 17.4425 8.5056 17.7361 8.64874L19.6261 4.83874C19.4299 4.73064 19.2169 4.65627 18.9961 4.61874Z" fill="#3F6DB5" />
                                                      <path d="M17.6558 19.2988C17.2874 18.8693 16.7689 18.5968 16.2062 18.5369C15.6436 18.4769 15.0793 18.6341 14.6286 18.9762C14.1779 19.3184 13.8749 19.8197 13.7815 20.3777C13.688 20.9358 13.8112 21.5085 14.1258 21.9788C14.3322 22.2502 14.5994 22.4694 14.9058 22.6188C15.1212 22.73 15.355 22.8012 15.5958 22.8288C16.0296 22.8889 16.4714 22.8187 16.8652 22.6273C17.2591 22.4359 17.5872 22.1318 17.8079 21.7536C18.0286 21.3754 18.1319 20.9401 18.1049 20.5031C18.0778 20.066 17.9215 19.6469 17.6558 19.2988Z" fill="#3F6DB5" />
                                                      <path d="M21.3859 9.68875C21.0125 8.72789 20.3784 7.89026 19.5549 7.2701C18.7315 6.64993 17.7513 6.27182 16.7247 6.1783C15.6981 6.08478 14.6657 6.27957 13.7437 6.74074C12.8218 7.20191 12.0468 7.91116 11.5059 8.78874L9.12589 12.6487C8.7199 12.5823 8.30327 12.6427 7.93284 12.8216C7.5624 13.0006 7.25618 13.2894 7.05589 13.6487L6.89588 13.9587C6.68242 14.4214 6.6536 14.9481 6.81528 15.4313C6.97697 15.9145 7.31696 16.3177 7.76588 16.5587L17.4159 21.3488C17.681 21.4772 17.9713 21.5455 18.2659 21.5488C18.4795 21.5448 18.6915 21.5112 18.8959 21.4487C19.3812 21.2713 19.779 20.913 20.0059 20.4487L20.1659 20.1388C20.2804 19.9112 20.3483 19.663 20.3654 19.4089C20.3826 19.1547 20.3488 18.8996 20.2659 18.6588C20.1611 18.3504 19.9826 18.0724 19.7459 17.8488L21.3859 13.6187C21.868 12.3531 21.868 10.9544 21.3859 9.68875Z" fill="#CB2027" />
                                                      <path d="M28.1861 14.4987C28.0696 14.4819 27.951 14.4886 27.8371 14.5184C27.7233 14.5483 27.6166 14.6006 27.5234 14.6724C27.4301 14.7442 27.3523 14.834 27.2943 14.9364C27.2364 15.0388 27.1996 15.1518 27.1861 15.2687C26.8354 18.0325 25.5403 20.5902 23.52 22.5085C21.4997 24.4268 18.8784 25.5878 16.1001 25.7949C13.3219 26.002 10.5575 25.2424 8.27506 23.6449C5.99266 22.0473 4.3326 19.71 3.57605 17.0287L4.63608 17.6087C4.83807 17.6985 5.06642 17.7089 5.27576 17.638C5.4851 17.5671 5.66009 17.4199 5.76593 17.2259C5.87177 17.0319 5.90069 16.8051 5.84699 16.5907C5.79328 16.3763 5.66089 16.19 5.47608 16.0687L2.78607 14.5887C2.58019 14.4776 2.33886 14.4521 2.11429 14.5176C1.88972 14.5831 1.69995 14.7344 1.58606 14.9387L0.10605 17.6287C-0.00455601 17.8331 -0.0298032 18.0729 0.0357684 18.2959C0.10134 18.5188 0.252413 18.7068 0.456057 18.8187C0.582825 18.8944 0.728481 18.9325 0.87607 18.9287C1.03308 18.9302 1.18756 18.8891 1.32312 18.8099C1.45868 18.7307 1.57027 18.6162 1.64606 18.4787L1.98606 17.8487C2.90364 20.8972 4.84414 23.5361 7.4805 25.3208C10.1169 27.1054 13.2879 27.9265 16.4591 27.6458C19.6303 27.3651 22.6077 25.9997 24.8896 23.7797C27.1715 21.5598 28.6182 18.621 28.9861 15.4587C28.9984 15.3428 28.9874 15.2256 28.9536 15.114C28.9198 15.0025 28.864 14.8989 28.7893 14.8093C28.7147 14.7198 28.6229 14.6461 28.5192 14.5928C28.4156 14.5394 28.3023 14.5074 28.1861 14.4987Z" fill="#1D5BAA" />
                                                      <path d="M29.4657 7.50872C29.3594 7.46244 29.245 7.43763 29.129 7.43571C29.0131 7.43379 28.8979 7.45482 28.7901 7.49757C28.6823 7.54032 28.584 7.60393 28.5009 7.68479C28.4178 7.76565 28.3515 7.86215 28.3057 7.96873L28.0358 8.60873C26.9172 5.86892 24.9498 3.55979 22.4224 2.02026C19.895 0.480722 16.9407 -0.208157 13.9931 0.0547273C11.0454 0.317612 8.25963 1.51842 6.04457 3.48091C3.82952 5.44339 2.30185 8.0642 1.68575 10.9587C1.652 11.1811 1.70466 11.4079 1.83294 11.5927C1.96121 11.7774 2.15537 11.906 2.37551 11.9521C2.59565 11.9982 2.82505 11.9582 3.01665 11.8404C3.20825 11.7226 3.34749 11.536 3.40575 11.3187C3.95587 8.76719 5.31694 6.46223 7.28557 4.74833C9.2542 3.03444 11.7247 2.00366 14.3276 1.8101C16.9306 1.61654 19.5263 2.27058 21.7268 3.67445C23.9272 5.07832 25.6143 7.15663 26.5358 9.59873L25.4158 9.11872C25.2075 9.05261 24.982 9.06638 24.7833 9.15734C24.5845 9.24831 24.4268 9.40997 24.3407 9.61085C24.2546 9.81173 24.2463 10.0375 24.3175 10.2441C24.3887 10.4507 24.5342 10.6235 24.7258 10.7287L27.5557 11.9487C27.6629 11.9958 27.7787 12.0196 27.8957 12.0187C28.0678 12.0192 28.2362 11.9693 28.3802 11.8751C28.5241 11.7809 28.6373 11.6466 28.7057 11.4887L29.9257 8.66873C30.0165 8.45368 30.0191 8.21159 29.9331 7.99461C29.8471 7.77763 29.6792 7.60313 29.4657 7.50872Z" fill="#1D5BAA" />
                                                      <path d="M3.57605 17.0287L4.63608 17.6087C4.83807 17.6985 5.06642 17.7089 5.27576 17.638C5.4851 17.5671 5.66009 17.4199 5.76593 17.2259C5.87177 17.0319 5.90069 16.8051 5.84699 16.5907C5.79328 16.3763 5.66089 16.19 5.47608 16.0687L2.78607 14.5887C2.58019 14.4776 2.33886 14.4521 2.11429 14.5176C1.88972 14.5831 1.69995 14.7344 1.58606 14.9387L0.10605 17.6287C-0.00455601 17.8331 -0.0298032 18.0729 0.0357684 18.2959C0.10134 18.5188 0.252413 18.7068 0.456057 18.8187C0.582825 18.8944 0.728481 18.9325 0.87607 18.9287C1.03308 18.9302 1.18756 18.8891 1.32312 18.8099C1.45868 18.7307 1.57027 18.6162 1.64606 18.4787L1.98606 17.8487C2.84292 20.6426 4.56216 23.0935 6.89743 24.8504C9.2327 26.6072 12.0641 27.5798 14.9861 27.6287V25.8687C12.3865 25.818 9.87251 24.9307 7.81714 23.3382C5.76177 21.7458 4.2745 19.5332 3.57605 17.0287Z" fill="#3F6DB5" />
                                                      <path d="M6.45574 3.13875C4.02421 5.12843 2.34204 7.88621 1.68575 10.9587C1.652 11.1811 1.70466 11.408 1.83294 11.5927C1.96121 11.7774 2.15537 11.9061 2.37551 11.9521C2.59565 11.9982 2.82505 11.9582 3.01665 11.8405C3.20825 11.7227 3.34749 11.536 3.40575 11.3187C3.97634 8.65252 5.43213 6.25775 7.5364 4.52386C9.64066 2.78998 12.2696 1.81898 14.9957 1.76875V0.0287476C11.8796 0.0713786 8.86958 1.16752 6.45574 3.13875Z" fill="#3F6DB5" />
                                                      <path d="M18.6859 6.72875C17.4474 6.11702 16.0252 5.98913 14.6975 6.37008C13.3697 6.75103 12.2317 7.61344 11.5059 8.78875L9.12589 12.6488C8.7199 12.5823 8.30327 12.6427 7.93284 12.8216C7.5624 13.0006 7.25618 13.2894 7.05589 13.6488L6.89588 13.9587C6.68242 14.4214 6.6536 14.9481 6.81528 15.4313C6.97697 15.9145 7.31696 16.3177 7.76588 16.5588L12.5959 19.0288L18.6859 6.75875V6.72875Z" fill="#EE3724" />
                                                    </svg>
                                                  </span>
                                                  <p className="span-text">{notification?.note || ' '}</p>
                                                </div>

                                              </div>
                                            </div>
                                          </div>
                                          <div className={`price-content price-${getColor(notification?.actionType)}`}>{notification?.amount ? `${notification?.actionType == 'cancel' ? "-" : notification?.actionType == 'new' ? '+' : " "}${notification?.amount}` : " "}</div>
                                          <div className={"time-content"}>Date:- {dayjs(new Date(`${notification?.createdAt}`))?.format("YYYY-MM-DD")}</div>
                                        </div>
                                      </Card>
                                    </div>
                                  ))
                                }
                              </>
                            </InfiniteScroll>
                          </div>
                        </>
                      }
                    </>
                }

              </Card>
            </>
          </Popover>
        </div>
      </>
    </>
  )
}

export default Notification
