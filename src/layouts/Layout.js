/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import {
  Accordion,
  Navbar,
  Header,
  useMantineTheme,
  Button,
  Text,
  Box,
  Menu,
  Modal,
  Tabs,
  Badge,
  LoadingOverlay,
} from "@mantine/core";
import { showNotification, cleanNotifications } from "@mantine/notifications";
import {
  faUserAlt,
  faAngleLeft,
  faAngleRight,
  faBullhorn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import MarqueeComponent from "react-marquee-master";
import moment from "moment";

import { getToken, setToken } from "../utils/token";
import config from "../config";
import menu from "../utils/menu";
import logo from "../assets/Logo.png";
import "./Layout.scss";
import history from "../utils/history";

const SiderMenu = (props) => {
  const [siderOpened, setSiderOpened] = useState(true);
  const { path, printMenu } = props;

  return (
    <div className={siderOpened ? "sider" : "sider-closed"}>
      <Navbar
        padding="xs"
        width={{ base: siderOpened ? 300 : 70 }}
        className="bg-sidebar"
        style={{
          padding: "10px 12px",
          minHeight: "calc(100vh - 60px)",
          height: "100%",
          transitionDuration: "0.5s",
        }}
      >
        <div
          className={
            props.sidebarPostion === "right"
              ? siderOpened
                ? "zoom-button-right"
                : "zoom-button-right zoom-button-closed-right"
              : siderOpened
              ? "zoom-button"
              : "zoom-button zoom-button-closed"
          }
          onClick={() => setSiderOpened(!siderOpened)}
        >
          <Icon
            icon={
              props.sidebarPostion === "right"
                ? siderOpened
                  ? faAngleRight
                  : faAngleLeft
                : siderOpened
                ? faAngleLeft
                : faAngleRight
            }
          />
        </div>
        <Accordion>
          {_.map(printMenu, (m, index) => {
            if (m.useable) {
              if (m.children.length === 1) {
                return (
                  <Accordion.Item
                    className="siderbar-border"
                    key={"p" + index}
                    value={`Accordion2${index}`}
                    onClick={() => {
                      // handleSetItem();
                      // props.GoOtherWindow(m.children[0].path);
                      history.push(m.children[0].path);
                    }}
                  >
                    <Accordion.Control
                      icon={
                        <Icon
                          icon={m.icon}
                          className={
                            path.includes(m.path)
                              ? "siderIcon font-primary"
                              : "siderIcon font-gray"
                          }
                        />
                      }
                    >
                      {
                        <span
                          className={`menu-title ${
                            path.includes(m.path) ? "font-primary" : "font-gray"
                          } ${
                            siderOpened ? "menu-title-print" : "menu-title-hide"
                          }`}
                        >
                          {m.title}
                        </span>
                      }
                    </Accordion.Control>
                  </Accordion.Item>
                );
              }
              return (
                <Accordion.Item
                  className="siderbar-border"
                  key={"p" + index}
                  value={`Accordion2${index}`}
                  onClick={() => {
                    if (!siderOpened) setSiderOpened(true);
                  }}
                >
                  <Accordion.Control
                    icon={
                      <Icon
                        icon={m.icon}
                        className={
                          path.includes(m.path)
                            ? "siderIcon font-primary"
                            : "siderIcon font-gray"
                        }
                      />
                    }
                  >
                    {
                      <span
                        className={`menu-title ${
                          path.includes(m.path) ? "font-primary" : "font-gray"
                        } ${
                          siderOpened ? "menu-title-print" : "menu-title-hide"
                        }`}
                      >
                        {m.title}
                      </span>
                    }
                  </Accordion.Control>
                  <Accordion.Panel>
                    {siderOpened && (
                      <Navbar.Section>
                        {_.map(m.children, (child, i) => {
                          if (child.useable) {
                            return (
                              <Box
                                key={i}
                                onClick={() => {
                                  // handleSetItem();
                                  // props.GoOtherWindow(child.path);
                                  history.push(child.path);
                                }}
                                className={
                                  path === child.path
                                    ? "bg-primary font-light"
                                    : "un-menu font-gray"
                                }
                                sx={(theme) => ({
                                  marginLeft: "56px",
                                  marginBottom: "4px",
                                  marginTop: "4px",
                                  padding: "6px",
                                  borderRadius: theme.radius.sm,
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  gap: 6,
                                  fontSize: "18px",
                                  fontWeight: "500",
                                  "&:hover": {
                                    backgroundColor:
                                      theme.colorScheme === "dark"
                                        ? theme.colors.dark[5]
                                        : theme.colors.gray[1],
                                  },
                                })}
                              >
                                <Text
                                  className={
                                    siderOpened
                                      ? "menu-title-print"
                                      : "menu-title-hide"
                                  }
                                >
                                  {child.title}
                                </Text>
                              </Box>
                            );
                          }
                        })}
                      </Navbar.Section>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              );
            }
          })}
        </Accordion>
      </Navbar>
    </div>
  );
};

const Layout = (props) => {
  const { Logout } = props; // dispatch
  const { Loading } = props; // state

  const theme = useMantineTheme();
  const [delay, setDelay] = useState(30);
  const sidebarPostion = "left";
  const path = `${config.url}${props.history.location.pathname}`;

  // menu權限設定
  const printMenu = _.cloneDeep(menu);

  useEffect(() => {
    if (props.Message) {
      const { color, message, title, autoClose, loading } = props.Message;

      showNotification({
        color: color,
        title: title,
        message: message,
        autoClose: autoClose,
        loading,
      });
      props.SAVE_Message(undefined);
    }
  }, [props.Message]);

  useEffect(() => {
    if (props.CleanMessage) {
      cleanNotifications();
      props.CLEAN_Message(false);
    }
  }, [props.CleanMessage]);

  const background =
    theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.white;

  return (
    <>
      <Header
        className="header"
        height={60}
        padding="xs"
        style={{ flex: " 0 auto" }}
      >
        <div className="header-content">
          <div className="left-block">
            {window.innerWidth >= 580 && (
              <Text
                className="font-light"
                style={{ fontSize: "24px", whiteSpace: "nowrap" }}
              ></Text>
            )}
            <table>
              <tbody>
                <tr className="marqueeTr">
                  <td className="marqueeLeftTd" aria-label="marquee">
                    <Icon icon={faBullhorn} className="font-primary" />
                  </td>
                  <td className="marqueeRightTd" aria-label="marquee">
                    <div
                      onMouseEnter={() => setDelay(9999)}
                      onMouseLeave={() => setDelay(30)}
                    >
                      <MarqueeComponent
                        delay={delay}
                        direction="left"
                        height="30"
                        marqueeItems={[moment().format("YYYY/MM/DD"), ""]}
                        marqueeItemClassName="marqueeItem"
                      ></MarqueeComponent>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="right-block">
            <Menu>
              <Menu.Target>
                <Button
                  className="button"
                  leftIcon={<Icon icon={faUserAlt} />}
                  // onClick={() => props.POST_PersonalBulletin({ account: userId })} 個人公告
                >
                  User
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={Logout}>登出</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </Header>
      <div
        id="Layout"
        className="layout"
        style={{ flexDirection: sidebarPostion === "top" ? "column" : "row" }}
      >
        {sidebarPostion === "left" && (
          <SiderMenu
            GoOtherWindow={props.GoOtherWindow}
            path={path}
            // UserPid={Process}
            sidebarPostion={sidebarPostion}
            printMenu={printMenu}
          />
        )}

        <div className="content" style={{ background }}>
          <LoadingOverlay visible={Loading} />
          <div
            className={`children ${
              sidebarPostion === "top"
                ? "top-menu-children"
                : "left-right-menu-children"
            }`}
          >
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    Message: _.get(state, "global.Message", false),
    CleanMessage: _.get(state, "global.CleanMessage", false),
    Marquee: _.get(state, "global.Marquee", []),
    PersonalBulletin: _.get(state, "global.PersonalBulletin", []),
    Title: _.get(state, "global.Title", ""),
    MenuPosition: _.get(state, "global.MenuPosition", ""),
    BackgroundColor: _.get(state, "global.BackgroundColor", ""),
    LogoSrc: _.get(state, "global.LogoSrc", ""),
    Loading: _.get(state, "global.Loading", false),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_Marquee(payload) {
      dispatch({ type: "GET_Marquee", payload });
    },
    GoOtherWindow(path) {
      dispatch({ type: "GoOtherWindow", path });
    },
    SAVE_Message(payload) {
      dispatch({ type: "SAVE_Message", payload });
    },
    CLEAN_Message(payload) {
      dispatch({ type: "CLEAN_Message", payload });
    },
    Logout() {
      dispatch({ type: "Logout" });
    },
    POST_PersonalBulletin(payload, callback, loading) {
      dispatch({ type: "POST_PersonalBulletin", payload, callback, loading });
    },
    GET_FrontendStyle() {
      dispatch({ type: "GET_FrontendStyle" });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
