import React from 'react'
import parse from 'html-react-parser';

const ActiveSubscription = ({Values}) => {
  console.log(Values)
  return (
    <div className="preview-changes">
    <p className="preview-changes-text">You’re previewing your changes</p>
        <div className="info-banner">
          <div className="details">
            <div className="profile">
              <div className="initials">IA</div>
              <div className="full-name">Ipsum Antely</div>
            </div>
          </div>
          <div className="details">
            <div className="contact">
              <p>{parse(Values?.contactBoxContent)}</p>
              <p>Monday - Friday 8:30 - 18:30</p>
            </div>
          </div>
          {
            Values?.showPromoButton==='true' && 
            <div className="details"><a className="btn-discount" href="#">{Values?.promoButtonContent}</a></div>
          }
          
        </div>
        <div className="Polaris-Page__Content">
          <div className="Polaris-Layout">
            <div className="Polaris-Layout__Section">
              <div className="Dashboard_wrapper__3SFrh">
                <div className="Polaris-Frame" data-has-navigation="true" data-polaris-layer="true" style={{paddingTop:'25px'}}>
                  <div>
                    <div id="AppFrameNav">
                      <div className="sm-nav-trigger">
                        <div className="icon-list">
                          <svg aria-hidden="true" fill="none" focusable="false" height="24px" viewBox="0 0 20 20" width="24px">
                            <path d="M6.63672 1.84473H19.016" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            <path d="M6.63672 7.55811H19.016" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            <path d="M6.63672 13.272H19.016" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            <path d="M1.875 1.84473H1.88356" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            <path d="M1.875 7.55811H1.88356" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                            <path d="M1.875 13.272H1.88356" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                          </svg>
                        </div><span className="open">OPEN ACCOUNT MENU</span><span className="close">CLOSE ACCOUNT MENU</span>
                        <div className="icon-chevron">
                          <svg fill="none" height="24px" viewBox="0 0 17 10" width="24px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 1L8.5 8L15.5 1" stroke="#4D506A" strokeWidth={2} />
                          </svg>
                        </div>
                      </div>
                      <nav className="Polaris-Navigation account">
                        <div className="Polaris-Navigation__PrimaryNavigation Polaris-Scrollable Polaris-Scrollable--vertical" data-polaris-scrollable="true">
                          <ul className="Polaris-Navigation__Section account-sidebar">
                            <li className="Polaris-Navigation__ListItem">
                              <div className="Polaris-Navigation__ItemWrapper">
                                <a className="Polaris-Navigation__Item Polaris-Navigation__Item--selected"  tabIndex={0}>
                                  <div className="Polaris-Navigation__Icon">
                                    <svg aria-hidden="true" className="Polaris-Icon__Svg" fill="none" focusable="false" viewBox="0 0 20 20">
                                      <path d="M6.63672 1.84473H19.016" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                      <path d="M6.63672 7.55811H19.016" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                      <path d="M6.63672 13.272H19.016" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                      <path d="M1.875 1.84473H1.88356" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                      <path d="M1.875 7.55811H1.88356" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                      <path d="M1.875 13.272H1.88356" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                    </svg>
                                  </div><span className="Polaris-Navigation__Text">Subscription</span></a>
                              </div>
                              <div className="Polaris-Navigation__SecondaryNavigation Polaris-Navigation--isExpanded">
                                <div aria-expanded="true" id="PolarisSecondaryNavigation15" style={{transitionDuration: '0ms', transitionTimingFunction: 'linear', maxHeight: 'none', overflow: 'visible'}}>
                                  <ul className="Polaris-Navigation__List">
                                    <li className="Polaris-Navigation__ListItem">
                                      <div className="Polaris-Navigation__ItemWrapper active-subscription"><span className="Polaris-Navigation__Text"><a className="Polaris-Navigation__Item" data-polaris-unstyled="true" tab_index={0} aria-disabled="false" ><span className="Polaris-Navigation__Text"><span>Active</span></span>
                                          </a>
                                        </span>
                                      </div>
                                    </li>
                                    <li className="Polaris-Navigation__ListItem">
                                      <div className="Polaris-Navigation__ItemWrapper cancel-subscription" /><a className="Polaris-Navigation__Item" data-polaris-unstyled="true" tab_index={0} aria-disabled="false" ><span className="Polaris-Navigation__Text"><span>Cancelled</span></span></a></li>
                                  </ul>
                                </div>
                              </div>
                            </li>
                            <li className="Polaris-Navigation__ListItem">
                              <div className="Polaris-Navigation__ItemWrapper">
                                <a className="Polaris-Navigation__Item"  tabIndex={0}>
                                  <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg fill="none" height={18} viewBox="0 0 22 18" width={22} xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0)"><path d="M18.8089 1.80762H4.08168C3.17794 1.80762 2.44531 2.59112 2.44531 3.55762V14.0576C2.44531 15.0241 3.17794 15.8076 4.08168 15.8076H18.8089C19.7127 15.8076 20.4453 15.0241 20.4453 14.0576V3.55762C20.4453 2.59112 19.7127 1.80762 18.8089 1.80762Z" fill="#E5E5E5" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /><path d="M2.44531 6.80762H20.4453" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></g><defs><clipPath id="clip0"><rect height={17} transform="translate(0.753906 0.556641)" width={21} /></clipPath></defs></svg></span></div><span className="Polaris-Navigation__Text">Delivery Schedules</span></a>
                              </div>
                            </li>
                            <li className="Polaris-Navigation__ListItem">
                              <div className="Polaris-Navigation__ItemWrapper">
                                <a className="Polaris-Navigation__Item"  tabIndex={0}>
                                  <div style={{marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}><span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg fill="none" height={19} viewBox="0 0 16 19" width={16} xmlns="http://www.w3.org/2000/svg"><path d="M9.2917 1.24365H2.88608C2.46136 1.24365 2.05403 1.41237 1.75371 1.71269C1.45339 2.01302 1.28467 2.42034 1.28467 2.84506V15.6563C1.28467 16.081 1.45339 16.4884 1.75371 16.7887C2.05403 17.089 2.46136 17.2577 2.88608 17.2577H12.4945C12.9192 17.2577 13.3266 17.089 13.6269 16.7887C13.9272 16.4884 14.0959 16.081 14.0959 15.6563V6.04787L9.2917 1.24365Z" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /><path d="M9.29199 1.24341V6.04763H14.0962" stroke="#4D506A" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg></span></div><span className="Polaris-Navigation__Text">Order History</span></a>
                              </div>
                            </li>
                            <li className="Polaris-Navigation__ListItem">
                              <div className="Polaris-Navigation__ItemWrapper">
                                <a className="Polaris-Navigation__Item"  tabIndex={0}>
                                  <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><img src="https://06c00288a45e.ngrok.io/assets/icons/address-86c025d50add34ce846dc6a61771f3634553c425fd8a7ba2a7bcb81ef4fae0d3.svg" /></span></div><span className="Polaris-Navigation__Text">Addresses</span></a>
                              </div>
                            </li>
                            <li className="Polaris-Navigation__ListItem">
                              <div className="Polaris-Navigation__ItemWrapper">
                                <a className="Polaris-Navigation__Item"  tabIndex={0}>
                                  <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg className="Polaris-Icon__Svg" fill="none" height={16} viewBox="0 0 16 16" width={16} xmlns="http://www.w3.org/2000/svg"><path d="M15.5 10C15.224 10 15 10.224 15 10.5V14H1V8H6.5C6.776 8 7 7.776 7 7.5C7 7.224 6.776 7 6.5 7H1V5H6.5C6.776 5 7 4.776 7 4.5C7 4.224 6.776 4 6.5 4H1C0.448 4 0 4.448 0 5V14C0 14.552 0.448 15 1 15H15C15.552 15 16 14.552 16 14V10.5C16 10.224 15.776 10 15.5 10Z" fill="#4D506A" /><path d="M15.5 10C15.224 10 15 10.224 15 10.5V14H1V8H6.5C6.776 8 7 7.776 7 7.5C7 7.224 6.776 7 6.5 7H1V5H6.5C6.776 5 7 4.776 7 4.5C7 4.224 6.776 4 6.5 4H1C0.448 4 0 4.448 0 5V14C0 14.552 0.448 15 1 15H15C15.552 15 16 14.552 16 14V10.5C16 10.224 15.776 10 15.5 10Z" stroke="#4D506A" /><path d="M4.5 10H2.5C2.224 10 2 10.224 2 10.5C2 10.776 2.224 11 2.5 11H4.5C4.776 11 5 10.776 5 10.5C5 10.224 4.776 10 4.5 10Z" fill="#4D506A" /><path d="M15.697 2.53975L12.197 1.03975C12.07 0.98675 11.929 0.98675 11.802 1.03975L8.302 2.53975C8.119 2.61875 8 2.79975 8 2.99975V4.99975C8 7.75075 9.017 9.35875 11.751 10.9338C11.828 10.9777 11.914 10.9998 12 10.9998C12.086 10.9998 12.172 10.9777 12.249 10.9338C14.983 9.36275 16 7.75475 16 4.99975V2.99975C16 2.79975 15.881 2.61875 15.697 2.53975ZM15 4.99975C15 7.30875 14.236 8.57975 12 9.91975C9.764 8.57675 9 7.30575 9 4.99975V3.32975L12 2.04375L15 3.32975V4.99975Z" fill="#4D506A" /><path d="M15.697 2.53975L12.197 1.03975C12.07 0.98675 11.929 0.98675 11.802 1.03975L8.302 2.53975C8.119 2.61875 8 2.79975 8 2.99975V4.99975C8 7.75075 9.017 9.35875 11.751 10.9338C11.828 10.9777 11.914 10.9998 12 10.9998C12.086 10.9998 12.172 10.9777 12.249 10.9338C14.983 9.36275 16 7.75475 16 4.99975V2.99975C16 2.79975 15.881 2.61875 15.697 2.53975ZM15 4.99975C15 7.30875 14.236 8.57975 12 9.91975C9.764 8.57675 9 7.30575 9 4.99975V3.32975L12 2.04375L15 3.32975V4.99975Z" stroke="#4D506A" /><path d="M13.8127 4.10886C13.5977 3.93886 13.2837 3.97186 13.1097 4.18686L11.5377 6.15286L10.9157 5.22286C10.7607 4.99286 10.4497 4.93186 10.2227 5.08386C9.99365 5.23686 9.93065 5.54786 10.0837 5.77686L11.0837 7.27686C11.1727 7.40986 11.3187 7.49186 11.4787 7.49986C11.4857 7.49986 11.4937 7.49986 11.4997 7.49986C11.6507 7.49986 11.7947 7.43186 11.8907 7.31186L13.8907 4.81186C14.0627 4.59586 14.0287 4.28186 13.8127 4.10886Z" fill="#4D506A" /></svg></span></div><span className="Polaris-Navigation__Text">Billings</span></a>
                              </div>
                            </li>
                            <li className="Polaris-Navigation__ListItem">
                              <div className="Polaris-Navigation__ItemWrapper">
                                <a className="Polaris-Navigation__Item" tabIndex={0}>
                                  <div className="Polaris-Navigation__Icon"><span className="Polaris-Icon"><svg fill="none" height={18} viewBox="0 0 18 18" width={18} xmlns="http://www.w3.org/2000/svg"><path d="M9.74356 17.2167C9.97365 17.1961 10.2008 17.1646 10.4251 17.1254L10.4256 17.1254L10.5096 17.1105L10.512 17.1101C14.7016 16.3283 17.6065 12.4849 17.2146 8.24146C16.8228 3.99801 13.2631 0.751343 9.00116 0.75L9.00108 0.75L8.75108 0.749921V0.753715C4.30986 0.885866 0.75 4.52729 0.75 9C0.75 13.5563 4.44422 17.25 9.00108 17.25C9.24959 17.25 9.49718 17.2389 9.74356 17.2167ZM9.74356 17.2167L9.72123 16.9677L9.74362 17.2167C9.7436 17.2167 9.74358 17.2167 9.74356 17.2167ZM8.36905 16.1884L8.37976 16.1893C8.58462 16.207 8.79252 16.2148 9.00239 16.2148C9.21075 16.2148 9.41702 16.2053 9.62374 16.1875L9.63444 16.1866H9.64518H9.65285C9.84931 16.1688 10.0448 16.1423 10.2391 16.1084L10.2428 16.1078L10.2428 16.1078C10.2578 16.1054 10.2616 16.105 10.2647 16.1045C10.2665 16.1043 10.2681 16.1041 10.2718 16.1034L10.2724 16.1033C10.4649 16.0688 10.6559 16.0257 10.8457 15.9756L10.8491 15.9747L10.8491 15.9747L10.8926 15.9639C11.0756 15.9142 11.2571 15.8562 11.437 15.7918C11.4484 15.7875 11.4596 15.7836 11.4676 15.7809C11.4723 15.7792 11.4763 15.7778 11.4798 15.7766C11.4834 15.7753 11.4866 15.7742 11.4897 15.7731L11.4904 15.7728C11.6671 15.7078 11.8415 15.635 12.0136 15.5557L12.0208 15.5523L12.0209 15.5524C12.0403 15.5442 12.0571 15.5369 12.073 15.5295L12.0731 15.5295C12.2403 15.4514 12.4055 15.3642 12.5695 15.2709C12.5761 15.2671 12.5828 15.2633 12.589 15.2598C12.5942 15.2569 12.599 15.2542 12.6035 15.2517C12.6142 15.2457 12.6229 15.2409 12.6312 15.2361L12.7568 15.4522M8.36905 16.1884L7.7426 16.1069L7.74107 16.1067C7.73517 16.1058 7.73427 16.1057 7.73451 16.1057L7.73452 16.1057L7.73111 16.1051C7.53875 16.0707 7.34798 16.0279 7.15862 15.9778L7.15674 15.9774L7.11117 15.9657C6.92806 15.916 6.74641 15.8582 6.5668 15.7937L6.56667 15.7937C6.54716 15.7867 6.53952 15.7842 6.53347 15.7822C6.52769 15.7803 6.52334 15.7789 6.51151 15.7745L6.51064 15.7742C6.33544 15.7098 6.16266 15.6374 5.99167 15.5587L5.99168 15.5587L5.98902 15.5575C5.98077 15.5538 5.97358 15.5507 5.96705 15.5478C5.95269 15.5414 5.94147 15.5365 5.92896 15.5305L5.92646 15.5294C5.76191 15.4532 5.599 15.3667 5.43696 15.2743L5.43633 15.2739L5.36684 15.2348C5.21001 15.1432 5.05627 15.0448 4.90481 14.9404C4.88606 14.9273 4.87661 14.9209 4.86791 14.915C4.85914 14.909 4.85115 14.9036 4.83516 14.8924C4.70433 14.7996 4.57609 14.7015 4.45043 14.599L4.45043 12.467C4.45043 12.4669 4.45043 12.4668 4.45043 12.4668C4.45232 10.9855 5.65284 9.78512 7.13447 9.78333H10.8677C12.3494 9.78512 13.5499 10.9856 13.5517 12.467V14.5978C13.4251 14.7014 13.2957 14.7999 13.1632 14.8937C13.1508 14.9023 13.1432 14.9075 13.1344 14.9134C13.1262 14.9189 13.117 14.9251 13.1021 14.9354L13.1018 14.9357C12.9485 15.0421 12.7915 15.1423 12.6305 15.2364L12.7568 15.4522M8.36905 16.1884H8.35829H8.35055C8.15445 16.1707 7.95932 16.1443 7.76533 16.1106L8.36905 16.1884ZM12.7568 15.4522C12.9232 15.3548 13.0858 15.2512 13.2444 15.141L12.6939 15.4878C12.7039 15.482 12.7141 15.4763 12.7243 15.4706C12.7352 15.4645 12.7461 15.4585 12.7568 15.4522ZM10.2821 16.3547C10.2864 16.354 10.2907 16.3534 10.295 16.3527C10.3022 16.3517 10.3093 16.3507 10.3165 16.3493L10.2821 16.3547ZM10.2821 16.3547C10.0778 16.3904 9.87164 16.4181 9.66406 16.4366H9.64518M10.2821 16.3547L9.64518 16.4366M9.64518 16.4366C9.43187 16.4549 9.21843 16.4648 9.00239 16.4648C8.78634 16.4648 8.57121 16.4568 8.35829 16.4384L9.64518 16.4366ZM14.5851 12.4667V12.4664C14.5828 10.4148 12.92 8.75237 10.8683 8.75H10.868H7.13416H7.13387C5.08213 8.75237 3.4194 10.4148 3.41703 12.4664V12.4667V13.5681C1.08087 10.7229 1.25346 6.51768 3.91482 3.87465C6.72944 1.07954 11.2727 1.07954 14.0874 3.87466C16.7487 6.51768 16.9213 10.7229 14.5851 13.5681V12.4667Z" fill="#4D506A" stroke="#4D506A" strokeWidth="0.5" /><path d="M9.06424 3.82199H9.06398C7.44134 3.82199 6.12598 5.13735 6.12598 6.75999C6.12598 8.38263 7.44134 9.69799 9.06398 9.69799C10.6866 9.69799 12.002 8.38263 12.002 6.75999V6.75973C12.0003 5.13795 10.686 3.82371 9.06424 3.82199ZM9.0637 8.66039C8.01422 8.66024 7.16358 7.80951 7.16358 6.75999C7.16358 5.71038 8.01437 4.85959 9.06398 4.85959C10.1135 4.85959 10.9642 5.71023 10.9644 6.75971C10.9632 7.80888 10.1129 8.65923 9.0637 8.66039Z" fill="#4D506A" stroke="#4D506A" strokeWidth="0.5" /></svg></span></div><span className="Polaris-Navigation__Text">Account</span></a>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </nav>
                    </div>
                  </div>
                  <div className="content-wrapper">
                    <div className="display-text">
                      <p><span>MY &nbsp;</span><span className="active">ACTIVE &nbsp;</span><span>SUBSCRIPTION</span></p><a className="add_weekly_box" href="#"><span >{parse(Values?.promoTagline1Content)}</span><svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg"><path d="M14.5148 0.514771L13.6239 1.40567L17.5882 5.37004H0V6.62998H17.5882L13.6239 10.5943L14.5148 11.4852L20 5.99996L14.5148 0.514771Z" fill="black" /></svg></a></div>
                    <div className="subscription-contract-products">
                      <div className="grid">
                        <div className="grid-item">
                          <div className="img account-img"><img alt="" src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/SG-CaliforniaLove_1200px.jpg?v=1616146041" /></div>
                          <p className="text active-text">California Love</p>
                          <p className="text active-text">$89.95 / 1 DAY</p>
                        </div>
                        <div className="grid-item">
                          <h4>NEXT CARD CHARGE</h4>
                          <p className="text right active-text">Sat, May 22</p>
                          <p className="text right active-text">$179.90</p>
                        </div>
                        <div className="grid-item">
                          <button aria-hidden="true" className="white-btn action-btn"  tabIndex={-1} type="button">SWAP SUBSCRIPTION</button>
                          <a >
                            <button className="white-btn action-btn">DELIVERY SCHEDULE</button>
                          </a>
                          <button className="edit-subscription white-btn action-btn"  >Edit Subscription</button>
                          {/* <button className="delivery-schedule text-btn action-btn"  >DELAY NEXT ORDER</button> */}
                          <div className="Polaris-Modal" id="delayOrderModal-1080164558">
                            <div className="Polaris-Modal-Dialog__Container" data-polaris-layer="true" data-polaris-overlay="true">
                              <div aria-labelledby="Polarismodal-header20" className="Polaris-Modal-Dialog" role="dialog" tabIndex={-1}>
                                <div className="Polaris-Modal-Dialog__Modal">
                                  <div className="Polaris-Modal__BodyWrapper">
                                    <div className="Polaris-Modal__Body Polaris-Scrollable Polaris-Scrollable--vertical delivery-delay-modal" data-polaris-scrollable="true">
                                      <div className="header">
                                        <div aria-hidden="true" className="close-modal" data-action="close" tabIndex={-1}>
                                          <svg fill="none" height={20} viewBox="0 0 18 20" width={18} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 19.824H2.212L8.484 10.864L14.756 19.824H17.052L9.688 9.408L16.408 0H14.196L8.568 8.064L2.856 0H0.672L7.448 9.408L0 19.824Z" fill="#212B36" />
                                          </svg>
                                        </div>
                                        <div>
                                          <h2>Delay/Speedup your next shipment</h2></div>
                                      </div>
                                      <form className="simple_form subscription" action="/a/chargezen_production/subscriptions/1080164558/update_subscription?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                        <div className="input hidden subscription_id">
                                          <input className="hidden" type="hidden" name="subscription[id]" id="subscription_id" />
                                        </div>
                                        <div className="btn-wrapper">
                                          <button className="open-dp" type="button"><span><svg fill="none" height={20} viewBox="0 0 20 20" width={20} xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0)"><path d="M15.0703 8.98438C15.5018 8.98438 15.8516 8.6346 15.8516 8.20312C15.8516 7.77165 15.5018 7.42188 15.0703 7.42188C14.6388 7.42188 14.2891 7.77165 14.2891 8.20312C14.2891 8.6346 14.6388 8.98438 15.0703 8.98438Z" fill="black" /><path d="M16.875 1.5625H15.8594V0.78125C15.8594 0.349766 15.5096 0 15.0781 0C14.6466 0 14.2969 0.349766 14.2969 0.78125V1.5625H10.7422V0.78125C10.7422 0.349766 10.3924 0 9.96094 0C9.52945 0 9.17969 0.349766 9.17969 0.78125V1.5625H5.66406V0.78125C5.66406 0.349766 5.3143 0 4.88281 0C4.45133 0 4.10156 0.349766 4.10156 0.78125V1.5625H3.125C1.40188 1.5625 0 2.96438 0 4.6875V16.875C0 18.5981 1.40188 20 3.125 20H9.10156C9.53305 20 9.88281 19.6502 9.88281 19.2188C9.88281 18.7873 9.53305 18.4375 9.10156 18.4375H3.125C2.26344 18.4375 1.5625 17.7366 1.5625 16.875V4.6875C1.5625 3.82594 2.26344 3.125 3.125 3.125H4.10156V3.90625C4.10156 4.33773 4.45133 4.6875 4.88281 4.6875C5.3143 4.6875 5.66406 4.33773 5.66406 3.90625V3.125H9.17969V3.90625C9.17969 4.33773 9.52945 4.6875 9.96094 4.6875C10.3924 4.6875 10.7422 4.33773 10.7422 3.90625V3.125H14.2969V3.90625C14.2969 4.33773 14.6466 4.6875 15.0781 4.6875C15.5096 4.6875 15.8594 4.33773 15.8594 3.90625V3.125H16.875C17.7366 3.125 18.4375 3.82594 18.4375 4.6875V9.14062C18.4375 9.57211 18.7873 9.92188 19.2188 9.92188C19.6502 9.92188 20 9.57211 20 9.14062V4.6875C20 2.96438 18.5981 1.5625 16.875 1.5625Z" fill="black" /><path d="M15.2819 10.5469C12.6756 10.5469 10.5553 12.6672 10.5553 15.2734C10.5553 17.8797 12.6756 20 15.2819 20C17.8881 20 20.0084 17.8797 20.0084 15.2734C20.0084 12.6672 17.8881 10.5469 15.2819 10.5469ZM15.2819 18.4375C13.5372 18.4375 12.1178 17.0181 12.1178 15.2734C12.1178 13.5287 13.5372 12.1094 15.2819 12.1094C17.0265 12.1094 18.4459 13.5287 18.4459 15.2734C18.4459 17.0181 17.0265 18.4375 15.2819 18.4375Z" fill="black" /><path d="M16.4031 14.4922H16.0515V13.6719C16.0515 13.2404 15.7017 12.8906 15.2703 12.8906C14.8388 12.8906 14.489 13.2404 14.489 13.6719V15.2734C14.489 15.7049 14.8388 16.0547 15.2703 16.0547H16.4031C16.8346 16.0547 17.1843 15.7049 17.1843 15.2734C17.1843 14.842 16.8346 14.4922 16.4031 14.4922Z" fill="black" /><path d="M11.6704 8.98438C12.1019 8.98438 12.4517 8.6346 12.4517 8.20312C12.4517 7.77165 12.1019 7.42188 11.6704 7.42188C11.2389 7.42188 10.8892 7.77165 10.8892 8.20312C10.8892 8.6346 11.2389 8.98438 11.6704 8.98438Z" fill="black" /><path d="M8.29211 12.3828C8.72359 12.3828 9.07336 12.033 9.07336 11.6016C9.07336 11.1701 8.72359 10.8203 8.29211 10.8203C7.86064 10.8203 7.51086 11.1701 7.51086 11.6016C7.51086 12.033 7.86064 12.3828 8.29211 12.3828Z" fill="black" /><path d="M4.89209 8.98438C5.32356 8.98438 5.67334 8.6346 5.67334 8.20312C5.67334 7.77165 5.32356 7.42188 4.89209 7.42188C4.46062 7.42188 4.11084 7.77165 4.11084 8.20312C4.11084 8.6346 4.46062 8.98438 4.89209 8.98438Z" fill="black" /><path d="M4.89209 12.3828C5.32356 12.3828 5.67334 12.033 5.67334 11.6016C5.67334 11.1701 5.32356 10.8203 4.89209 10.8203C4.46062 10.8203 4.11084 11.1701 4.11084 11.6016C4.11084 12.033 4.46062 12.3828 4.89209 12.3828Z" fill="black" /><path d="M4.89209 15.7812C5.32356 15.7812 5.67334 15.4315 5.67334 15C5.67334 14.5685 5.32356 14.2188 4.89209 14.2188C4.46062 14.2188 4.11084 14.5685 4.11084 15C4.11084 15.4315 4.46062 15.7812 4.89209 15.7812Z" fill="black" /><path d="M8.29211 15.7812C8.72359 15.7812 9.07336 15.4315 9.07336 15C9.07336 14.5685 8.72359 14.2188 8.29211 14.2188C7.86064 14.2188 7.51086 14.5685 7.51086 15C7.51086 15.4315 7.86064 15.7812 8.29211 15.7812Z" fill="black" /><path d="M8.29211 8.98438C8.72359 8.98438 9.07336 8.6346 9.07336 8.20312C9.07336 7.77165 8.72359 7.42188 8.29211 7.42188C7.86064 7.42188 7.51086 7.77165 7.51086 8.20312C7.51086 8.6346 7.86064 8.98438 8.29211 8.98438Z" fill="black" /></g><defs><clipPath id="clip0"><rect fill="white" height={20} width={20} /></clipPath></defs></svg></span><span>PICK ORDER DATE</span></button>
                                        </div>
                                        <input className="datepicker-delay" id="input-1080164558" name="subscription[next_billing_date]" type="text" />
                                        <div className="append-dp" id="append-dp-1080164558">
                                          <div className="btn-wrapper calender-btn">
                                            <button className="back-dp" type="button">BACK</button>
                                            <button type="submit">APPLY</button>
                                          </div>
                                        </div>
                                      </form>
                                      <div className="options-btn-wrapper">
                                        <form className="simple_form subscription" action="/a/chargezen_production/subscriptions/1080164558/update_subscription?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                          <div className="input hidden subscription_id">
                                            <input className="hidden" type="hidden" name="subscription[id]" id="subscription_id" />
                                          </div>
                                          <div className="input hidden subscription_next_billing_date">
                                            <input defaultValue="2021-06-05" className="hidden" type="hidden" name="subscription[next_billing_date]" id="subscription_next_billing_date" />
                                          </div>
                                          <div className="btn-wrapper">
                                            <button type="submit">DELAY FOR 2 WEEKS</button>
                                          </div>
                                        </form>
                                        <form className="simple_form subscription" action="/a/chargezen_production/subscriptions/1080164558/update_subscription?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                          <div className="input hidden subscription_id">
                                            <input className="hidden" type="hidden" name="subscription[id]" id="subscription_id" />
                                          </div>
                                          <div className="input hidden subscription_next_billing_date">
                                            <input defaultValue="2021-06-22" className="hidden" type="hidden" name="subscription[next_billing_date]" id="subscription_next_billing_date" />
                                          </div>
                                          <div className="btn-wrapper">
                                            <button type="submit">DELAY FOR 1 MONTHS</button>
                                          </div>
                                        </form>
                                        <form className="simple_form subscription" action="/a/chargezen_production/subscriptions/1080164558/update_subscription?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                          <div className="input hidden subscription_id">
                                            <input className="hidden" type="hidden" name="subscription[id]" id="subscription_id" />
                                          </div>
                                          <div className="input hidden subscription_next_billing_date">
                                            <input defaultValue="2021-07-22" className="hidden" type="hidden" name="subscription[next_billing_date]" id="subscription_next_billing_date" />
                                          </div>
                                          <div className="btn-wrapper">
                                            <button type="submit">DELAY FOR 2 MONTHS</button>
                                          </div>
                                        </form>
                                        <form className="simple_form subscription" action="/a/chargezen_production/subscriptions/1080164558/update_subscription?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                          <div className="input hidden subscription_id">
                                            <input className="hidden" type="hidden" name="subscription[id]" id="subscription_id" />
                                          </div>
                                          <div className="input hidden subscription_next_billing_date">
                                            <input defaultValue="2021-08-22" className="hidden" type="hidden" name="subscription[next_billing_date]" id="subscription_next_billing_date" />
                                          </div>
                                          <div className="btn-wrapper">
                                            <button type="submit">DELAY FOR 3 MONTHS</button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="Polaris-Backdrop" />
                          </div>
                          <div className="Polaris-Modal" id="editSubscriptionModal-e690d228-6f59-4402-99fc-12ce1596ee1e">
                            <div className="Polaris-Modal-Dialog__Container" data-polaris-layer="true" data-polaris-overlay="true">
                              <div aria-labelledby="Polarismodal-header20" className="Polaris-Modal-Dialog" role="dialog" tabIndex={-1}>
                                <div className="Polaris-Modal-Dialog__Modal">
                                  <div className="Polaris-Modal__BodyWrapper">
                                    <div className="Polaris-Modal__Body Polaris-Scrollable Polaris-Scrollable--vertical edit-subscription-modal" data-polaris-scrollable="true">
                                      <div className="header">
                                        <div>
                                          <h2>Edit Subscription</h2></div>
                                        <div aria-hidden="true" className="close-modal" data-action="close" tabIndex={-1}>
                                          <svg fill="none" height={20} viewBox="0 0 18 20" width={18} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 19.9998H2.212L8.484 11.0398L14.756 19.9998H17.052L9.688 9.58378L16.408 0.175781H14.196L8.568 8.23978L2.856 0.175781H0.672L7.448 9.58378L0 19.9998Z" fill="#DDDDDD" />
                                          </svg>
                                        </div>
                                      </div>
                                      <div className="subscription-details">
                                        <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/SG-CaliforniaLove_1200px.jpg?v=1616146041" /></div>
                                        <div className="title">
                                          <h2>California Love</h2>
                                          <h3>$89.95 / 1 DAY</h3></div>
                                        <div className="delivery-charge">
                                          <div>
                                            <h3>est. next delivery</h3>
                                            <h4>Wed, May 26</h4></div>
                                          <div>
                                            <h3>NEXt card charge</h3>
                                            <h4>Sat, May 22</h4></div>
                                        </div>
                                        <div className="btn-wrapper">
                                          <button aria-hidden="true" className="upgrade-subscription"   type="button">UPGRADE SUBSCRIPTION</button>
                                          <button aria-hidden="true" className="swap-subscription"     type="button">SWAP SUBSCRIPTION</button>
                                          <button className="downgrade-subscription light" type="button">DOWNGRADE SUBSCRIPTION</button>
                                          <button className="ask-questions light" type="button">ASK A QUESTION</button>
                                          <button aria-hidden="true" className="cancel-subscription"    type="button">CANCEL SUBSCRIPTION</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="Polaris-Backdrop" />
                          </div>
                          <div className="Polaris-Modal" id="swap-e690d228-6f59-4402-99fc-12ce1596ee1e">
                            <div className="Polaris-Modal-Dialog__Container" data-polaris-layer="true" data-polaris-overlay="true">
                              <div aria-labelledby="Polarismodal-header20" className="Polaris-Modal-Dialog" role="dialog" tabIndex={-1}>
                                <div className="Polaris-Modal-Dialog__Modal Polaris-Modal-Dialog--sizeLarge">
                                  <div className="Polaris-Modal__BodyWrapper">
                                    <div className="Polaris-Modal__Body Polaris-Scrollable Polaris-Scrollable--vertical swap-subscription-modal" data-polaris-scrollable="true">
                                      <div className="header">
                                        <div>
                                          <h2><span>Swap&nbsp;</span><span className="blue">California Love</span><span>&nbsp;Subscription to:</span></h2></div>
                                        <div aria-hidden="true" className="close-modal" data-action="close" tabIndex={-1}>
                                          <svg fill="none" height={20} viewBox="0 0 18 20" width={18} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 19.9998H2.212L8.484 11.0398L14.756 19.9998H17.052L9.688 9.58378L16.408 0.175781H14.196L8.568 8.23978L2.856 0.175781H0.672L7.448 9.58378L0 19.9998Z" fill="#DDDDDD" />
                                          </svg>
                                        </div>
                                      </div>
                                      <div className="swap-grid">
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_600411c1-dff0-4bcb-91e1-c2dd5fe5538d.jpg?v=1616145875" /></div>
                                          <div className="title">
                                            <h2>Deluxe Black Velvet Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label htmlFor="input-0">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" id="input-0" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329528414414" />Black ($129.95)</label>
                                              <label htmlFor="input-1">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input id="input-1" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329528447182" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White.jpg?v=1616145940" /></div>
                                          <div className="title">
                                            <h2>Deluxe 24K Magic Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label htmlFor="input-0">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" id="input-0" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329530020046" />Black ($129.95)</label>
                                              <label htmlFor="input-1">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input id="input-1" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329530052814" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/KJR0245_web2_15b9f903-667d-410f-8a76-4cd25098bacd.png?v=1616145949" /></div>
                                          <div className="title">
                                            <h2>24K Magic Candle</h2>
                                            <p>$49.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label htmlFor="input-0">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="49.95" />
                                                <input defaultChecked="checked" id="input-0" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329530085582" />Black ($49.95)</label>
                                              <label htmlFor="input-1">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="49.95" />
                                                <input id="input-1" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329530118350" />White ($49.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/SG-24KMagic_120_1200px_2021.jpg?v=1616146017" /></div>
                                          <div className="title">
                                            <h2>24K Magic</h2>
                                            <p>$44.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label htmlFor="input-0">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="44.95" />
                                                <input defaultChecked="checked" id="input-0" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329531134158" />120mL ($44.95)</label>
                                              <label htmlFor="input-1">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="54.95" />
                                                <input id="input-1" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329531166926" />200mL ($54.95)</label>
                                              <label htmlFor="input-2">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="89.95" />
                                                <input id="input-2" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329531199694" />500mL ($89.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/SG-CaliforniaLove_1200px.jpg?v=1616146041" /></div>
                                          <div className="title">
                                            <h2>California Love</h2>
                                            <p>$44.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label htmlFor="input-0">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="44.95" />
                                                <input defaultChecked="checked" id="input-0" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329532215502" />120mL ($44.95)</label>
                                              <label htmlFor="input-1">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="54.95" />
                                                <input id="input-1" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329532248270" />200mL ($54.95)</label>
                                              <label htmlFor="input-2">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="89.95" />
                                                <input id="input-2" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329532281038" />500mL ($89.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/Aroma_Mist_20cc38a3-90f9-425c-8d0d-6ab9793a3436.jpg?v=1616146057" /></div>
                                          <div className="title">
                                            <h2>California Love Aroma Mist</h2>
                                            <p>$49.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label htmlFor="input-0">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="49.95" />
                                                <input defaultChecked="checked" id="input-0" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329533001934" />100mL ($49.95)</label>
                                              <label htmlFor="input-1">
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="24.95" />
                                                <input id="input-1" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329533034702" />30mL ($24.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="Polaris-Backdrop" />
                          </div>
                          <div className="Polaris-Modal" id="upgrade-e690d228-6f59-4402-99fc-12ce1596ee1e">
                            <div className="Polaris-Modal-Dialog__Container" data-polaris-layer="true" data-polaris-overlay="true">
                              <div aria-labelledby="Polarismodal-header20" className="Polaris-Modal-Dialog" role="dialog" tabIndex={-1}>
                                <div className="Polaris-Modal-Dialog__Modal Polaris-Modal-Dialog--sizeLarge">
                                  <div className="Polaris-Modal__BodyWrapper">
                                    <div className="Polaris-Modal__Body Polaris-Scrollable Polaris-Scrollable--vertical swap-subscription-modal" data-polaris-scrollable="true">
                                      <div className="header">
                                        <div>
                                          <h2><span>Upgrade&nbsp;</span><span className="blue">California Love</span><span>Subscription to:</span></h2></div>
                                        <div aria-hidden="true" className="close-modal" data-action="close" tabIndex={-1}>
                                          <svg fill="none" height={20} viewBox="0 0 18 20" width={18} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 19.9998H2.212L8.484 11.0398L14.756 19.9998H17.052L9.688 9.58378L16.408 0.175781H14.196L8.568 8.23978L2.856 0.175781H0.672L7.448 9.58378L0 19.9998Z" fill="#DDDDDD" />
                                          </svg>
                                        </div>
                                      </div>
                                      <div className="swap-grid">
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_600411c1-dff0-4bcb-91e1-c2dd5fe5538d.jpg?v=1616145875" /></div>
                                          <div className="title">
                                            <h2>Deluxe Black Velvet Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329528414414" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329528447182" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_6b5141ba-ab75-47d9-b7fc-443c7f1e4005.jpg?v=1616145900" /></div>
                                          <div className="title">
                                            <h2>Deluxe Desert Rose Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329528938702" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329528971470" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_f4d05ee4-2aaa-400b-94ce-0e4e2c1870c4.jpg?v=1616145906" /></div>
                                          <div className="title">
                                            <h2>Deluxe Midnight in Paris Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529168078" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529200846" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_246b7419-dd32-4e2c-bd1d-76f78927f1e6.jpg?v=1616145912" /></div>
                                          <div className="title">
                                            <h2>Deluxe November Rain Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529266382" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529299150" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_6d881064-bdb8-4f1e-b859-4437edad4ede.jpg?v=1616145917" /></div>
                                          <div className="title">
                                            <h2>Deluxe California Love Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529364686" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529397454" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_464580f9-f664-4f6f-9e5d-1c4c33e9f843.jpg?v=1616145922" /></div>
                                          <div className="title">
                                            <h2>Deluxe Mystify Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529495758" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529528526" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_63f4a728-aef0-43a0-bfa4-50903412b641.jpg?v=1616145927" /></div>
                                          <div className="title">
                                            <h2>Deluxe Dream On Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529626830" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529659598" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_f22e7c0b-b713-4f0f-8972-bc0011a9a685.jpg?v=1616145932" /></div>
                                          <div className="title">
                                            <h2>Deluxe Sweetest Taboo Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529692366" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529725134" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White_e04bd376-1e1e-444f-8e9b-efdf746077bc.jpg?v=1616145936" /></div>
                                          <div className="title">
                                            <h2>Deluxe My Way Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529954510" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329529987278" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/55oz-Black-White.jpg?v=1616145940" /></div>
                                          <div className="title">
                                            <h2>Deluxe 24K Magic Candle</h2>
                                            <p>$129.95 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329530020046" />Black ($129.95)</label>
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="129.95" />
                                                <input name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329530052814" />White ($129.95)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                        <div className="item">
                                          <div className="img"><img src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/Davinci-Web-isometric_b0618a82-4602-473a-80e0-d9f012814d80.jpg?v=1616146061" /></div>
                                          <div className="title">
                                            <h2>DaVinci360</h2>
                                            <p>$599.99 / 1 DAY</p>
                                          </div>
                                          <form id="form-gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" action="/a/chargezen_production/subscriptions/1080164558/swap_product?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                                            <div className="variants-wrapper">
                                              <label>
                                                <input className="hidden" name="line_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" />
                                                <input name="variant_price" type="hidden" defaultValue="599.99" />
                                                <input defaultChecked="checked" name="variant_id" type="radio" defaultValue="gid://shopify/ProductVariant/39329533067470" />Default Title ($599.99)</label>
                                            </div>
                                            <div className="btn-wrapper">
                                              <button type="submit"><span>SWAP SUBSCRIPTION &nbsp;</span><span />
                                                <svg fill="none" height={12} viewBox="0 0 20 12" width={20} xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M14.5148 0.514648L13.6239 1.40555L17.5882 5.36991H0V6.62985H17.5882L13.6239 10.5942L14.5148 11.4851L20 5.99984L14.5148 0.514648Z" fill="white" />
                                                </svg>
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="Polaris-Backdrop" />
                          </div>
                          <div className="Polaris-Modal" id="cancel-e690d228-6f59-4402-99fc-12ce1596ee1e">
                            <div className="Polaris-Modal-Dialog__Container" data-polaris-layer="true" data-polaris-overlay="true">
                              <div aria-labelledby="Polarismodal-header20" className="Polaris-Modal-Dialog" role="dialog" tabIndex={-1}>
                                <div className="Polaris-Modal-Dialog__Modal Polaris-Modal-Dialog--sizeLarge">
                                  <div className="Polaris-Modal__BodyWrapper">
                                    <div className="Polaris-Modal__Body Polaris-Scrollable Polaris-Scrollable--vertical cancel-subscription-modal" data-polaris-scrollable="true">
                                      <div className="header">
                                        <div>
                                          <h2><span>Cancel&nbsp;</span><span className="blue">California Love</span><span>&nbsp;Subscription</span></h2></div>
                                        <div aria-hidden="true" className="close-modal" data-action="close" tabIndex={-1}>
                                          <svg fill="none" height={20} viewBox="0 0 18 20" width={18} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 19.9998H2.212L8.484 11.0398L14.756 19.9998H17.052L9.688 9.58378L16.408 0.175781H14.196L8.568 8.23978L2.856 0.175781H0.672L7.448 9.58378L0 19.9998Z" fill="#DDDDDD" />
                                          </svg>
                                        </div>
                                      </div>
                                      <div className="warning">
                                        <h2>Are you sure you want to cancel?</h2>
                                        <h3>IF you cancel, you won't get upcomming deliveries</h3>
                                        <p>You get always reactive anytime</p>
                                      </div>
                                      <div className="btn-wrapper">
                                        <a data-remote="true" rel="nofollow" data-method="post">
                                          <button className="btn-cancel" type="button">CANCEL ANYWAY</button>
                                        </a>
                                        <button aria-hidden="true" className="btn-keep"  tabIndex={-1} type="button">KEEP SUBSCRIPTION</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="Polaris-Backdrop" />
                          </div>
                        </div>
                      </div>
                      <div className="quantity-wrapper">
                        <form action="/a/chargezen_production/subscriptions/1080164558/update_quantity?customer_id=5029176705230" data-remote encType="multipart/form-data" method="post">
                          <div className="quantity-field">
                            <div><span className="label active-text">Quantity:</span><span className="btn-wrapper"><button className="minus-quantity" type="button"><svg fill="none" height={8} viewBox="0 0 7 2" width={8} xmlns="http://www.w3.org/2000/svg"><path d="M7 0H0V1.5H7V0Z" fill="#637381" /></svg></button><input className="quatity-val" name="quantity" type="number" defaultValue={2} /><button className="plus-quantity" type="button"><svg fill="none" height={8} viewBox="0 0 8 8" width={8} xmlns="http://www.w3.org/2000/svg"><path d="M0 3.08V4.508H3.08V7.588H4.508V4.508H7.588V3.08H4.508V0H3.08V3.08H0Z" fill="#212B36" /></svg></button><input className="prev-quantity" type="hidden" defaultValue={2} /></span><span className="update-quantity"><input className="hidden" name="line_item_id" type="text" defaultValue="gid://shopify/SubscriptionLine/e690d228-6f59-4402-99fc-12ce1596ee1e" /><button type="submit">APPLY</button></span></div>
                            <div>
                              <div className="chevron">
                                <svg fill="none" height={30} viewBox="0 0 30 30" width={30} xmlns="http://www.w3.org/2000/svg">
                                  <circle cx={15} cy={15} r={14} stroke="#007EFF" strokeWidth={2} />
                                  <path d="M7.5 12L14.5 19L21.5 12" stroke="#007EFF" strokeWidth={2} />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="slide-down" style={{display: 'none'}}>
                        <div className="item">
                          <p>start date</p>
                          <p>Fri, March 19</p>
                        </div>
                        <div className="item">
                          <p>est. next delivery</p>
                          <p>Sat, May 22</p>
                        </div>
                        <div className="item">
                          <p>last card charge</p>
                          <p>-</p>
                        </div>
                        <div className="item">
                          <p>quantity</p>
                          <p>2</p>
                        </div>
                      </div>
                      <div className="delivery-address">
                        <div>
                          <p className="text active-text">DELIVERY ADDRESS</p>
                          <h3 className="active-text">123 MAIN STREET, SOMEWHERE, CA 94000</h3></div>
                        <div>
                          <button className="edit-address">EDIT</button>
                        </div>
                      </div>
                      <div className="Polaris-Modal" id="deliveryEditModal">
                        <div className="Polaris-Modal-Dialog__Container" data-polaris-layer="true" data-polaris-overlay="true">
                          <form className="simple_form address" action="/a/chargezen_production/subscriptions/1080164558/update_shiping_detail?customer_id=5029176705230" acceptCharset="UTF-8" data-remote="true" method="post">
                            <div aria-labelledby="Polarismodal-header20" className="Polaris-Modal-Dialog" role="dialog" tabIndex={-1}>
                              <div className="Polaris-Modal-Dialog__Modal Polaris-Modal-Dialog--sizeLarge">
                                <div className="Polaris-Modal__BodyWrapper">
                                  <div className="Polaris-Modal__Body Polaris-Scrollable Polaris-Scrollable--vertical" data-polaris-scrollable="true">
                                    <div className="input hidden address_id">
                                      <input className="hidden" type="hidden" name="address[id]" id="address_id" />
                                    </div>
                                    <section className="Polaris-Modal-Section">
                                      <div className="modal-fields-wrapper">
                                        <div className="group">
                                          <p><span>FIRST NAME</span><span className="red">*</span></p>
                                          <div className="input string required address_firstName">
                                            <input defaultValue="subscription" className="string required" required="required" aria-required="true" type="text" name="address[firstName]" id="address_firstName" />
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p><span>LAST NAME</span><span className="red">*</span></p>
                                          <div className="input string required address_lastName">
                                            <input defaultValue="testing" className="string required" required="required" aria-required="true" type="text" name="address[lastName]" id="address_lastName" />
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p><span>ADDRESS 1</span><span className="red">*</span></p>
                                          <div className="input string required address_address1">
                                            <input defaultValue="600 California street, San Francisco CA 95108" className="string required" required="required" aria-required="true" type="text" name="address[address1]" id="address_address1" />
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p>ADDRESS 2</p>
                                          <div className="input string optional address_address2">
                                            <input defaultValue className="string optional" type="text" name="address[address2]" id="address_address2" />
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p>COMPANY</p>
                                          <div className="input string optional address_company">
                                            <input defaultValue className="string optional" type="text" name="address[company]" id="address_company" />
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p><span>CITY</span><span className="red">*</span></p>
                                          <div className="input string required address_city">
                                            <input defaultValue="San Francisco" className="string required" required="required" aria-required="true" type="text" name="address[city]" id="address_city" />
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p><span>COUNTRY</span><span className="red">*</span></p>
                                          <div className="input select required address_country">
                                            <select className="select required" required="required" aria-required="true" name="address[country]" id="address_country">
                                              <option value />
                                              <option selected="selected" value="United States">United States</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p><span>ZIP/POSTAL CODE</span><span className="red">*</span></p>
                                          <div className="input string required address_zip">
                                            <input defaultValue={95108} className="string required" required="required" aria-required="true" type="text" name="address[zip]" id="address_zip" />
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p>STATE/PROVINCE</p>
                                          <div className="input string optional address_province">
                                            <input defaultValue="California" className="string optional" type="text" name="address[province]" id="address_province" />
                                          </div>
                                        </div>
                                        <div className="group">
                                          <p>PHONE</p>
                                          <div className="input tel optional address_phone">
                                            <input defaultValue className="string tel optional" type="tel" name="address[phone]" id="address_phone" />
                                          </div>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                </div>
                                <div className="Polaris-Modal-Footer">
                                  <button aria-hidden="true" className="Polaris-Button mr-10" data-action="close" tabIndex={-1} type="button">Cancel</button>
                                  <button className="Polaris-Button Polaris-Button--primary" type="submit"><span className="Polaris-Button__Content"><span className="Polaris-Button__Spinner hide"><span className="Polaris-Spinner Polaris-Spinner--colorWhite Polaris-Spinner--sizeSmall"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z" /></svg></span><span role="status"><span className="Polaris-VisuallyHidden">Loading</span></span>
                                      </span><span className="Polaris-Button__Text">Update</span></span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className="Polaris-Backdrop" />
                      </div>
                    </div>
                    <div className="display-text cancel-text">
                      <p><span>MY &nbsp;</span><span className="canceled">CANCELLED &nbsp;</span><span>SUBSCRIPTION</span></p>
                    </div>
                    <div className="subscription-contract-products">
                      <div className="grid">
                        <div className="grid-item">
                          <div className="img account-img"><img alt="" src="https://cdn.shopify.com/s/files/1/0553/2866/9902/products/SG-24KMagic_120_1200px_2021.jpg?v=1616146017" /></div>
                          <p className="text cancel-text">24K Magic</p>
                          <p className="text cancel-text">$40.46 / 1 MONTH</p>
                        </div>
                        <div className="grid-item" />
                        <div className="grid-item">
                          <a data-remote="true" rel="nofollow" data-method="post" >
                            <button className="blue-btn action-btn">RE-ACTIVATE</button>
                          </a>
                        </div>
                      </div>
                      <div className="quantity-wrapper">
                        <form>
                          <div className="quantity-field">
                            <div />
                            <div>
                              <div className="chevron">
                                <svg fill="none" height={30} viewBox="0 0 30 30" width={30} xmlns="http://www.w3.org/2000/svg">
                                  <circle cx={15} cy={15} r={14} stroke="#007EFF" strokeWidth={2} />
                                  <path d="M7.5 12L14.5 19L21.5 12" stroke="#007EFF" strokeWidth={2} />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="slide-down" style={{display: 'none'}}>
                        <div className="item">
                          <p>start date</p>
                          <p>Tue, April 6</p>
                        </div>
                        <div className="item">
                          <p>quantity</p>
                          <p>1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ActiveSubscription
