import { useCallback, useEffect, useRef, useState } from "react";

import { Link, useLocation } from "react-router";

import { ChevronDownIcon, HorizontaLDots } from "../icons";

import { useSidebar } from "../context/SidebarContext";

import { useAdminModule } from "../context/AdminModuleContext";

import {

  isNavPathActive,

  mlmNavItems,

  shoppingNavItems,

  type NavItem,

} from "../config/adminNav.config";



const AppSidebar: React.FC = () => {

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const { module, homePath } = useAdminModule();

  const location = useLocation();

  const navItems = module === "mlm" ? mlmNavItems : shoppingNavItems;



  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(

    {}

  );

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});



  const isActive = useCallback(

    (path: string) => isNavPathActive(location.pathname, path),

    [location.pathname]

  );



  useEffect(() => {

    let submenuMatched = false;

    navItems.forEach((nav, index) => {

      if (nav.subItems) {

        nav.subItems.forEach((subItem) => {

          if (isActive(subItem.path)) {

            setOpenSubmenu(index);

            submenuMatched = true;

          }

        });

      }

    });



    if (!submenuMatched) {

      setOpenSubmenu(null);

    }

  }, [location, isActive, navItems]);



  useEffect(() => {

    if (openSubmenu !== null) {

      const key = `main-${openSubmenu}`;

      if (subMenuRefs.current[key]) {

        setSubMenuHeight((prevHeights) => ({

          ...prevHeights,

          [key]: subMenuRefs.current[key]?.scrollHeight || 0,

        }));

      }

    }

  }, [openSubmenu]);



  const handleSubmenuToggle = (index: number) => {

    setOpenSubmenu((prev) => (prev === index ? null : index));

  };



  const renderMenuItems = (items: NavItem[]) => (

    <ul className="flex flex-col gap-4">

      {items.map((nav, index) => (

        <li key={nav.name}>

          {nav.subItems ? (

            <button

              onClick={() => handleSubmenuToggle(index)}

              className={`menu-item group ${

                openSubmenu === index

                  ? "menu-item-active"

                  : "menu-item-inactive"

              } cursor-pointer ${

                !isExpanded && !isHovered

                  ? "lg:justify-center"

                  : "lg:justify-start"

              }`}

            >

              <span

                className={`menu-item-icon-size ${

                  openSubmenu === index

                    ? "menu-item-icon-active"

                    : "menu-item-icon-inactive"

                }`}

              >

                {nav.icon}

              </span>

              {(isExpanded || isHovered || isMobileOpen) && (

                <span className="menu-item-text">{nav.name}</span>

              )}

              {(isExpanded || isHovered || isMobileOpen) && (

                <ChevronDownIcon

                  className={`ml-auto h-5 w-5 transition-transform duration-200 ${

                    openSubmenu === index ? "rotate-180 text-brand-500" : ""

                  }`}

                />

              )}

            </button>

          ) : (

            nav.path && (

              <Link

                to={nav.path}

                className={`menu-item group ${

                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"

                }`}

              >

                <span

                  className={`menu-item-icon-size ${

                    isActive(nav.path)

                      ? "menu-item-icon-active"

                      : "menu-item-icon-inactive"

                  }`}

                >

                  {nav.icon}

                </span>

                {(isExpanded || isHovered || isMobileOpen) && (

                  <span className="menu-item-text">{nav.name}</span>

                )}

              </Link>

            )

          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (

            <div

              ref={(el) => {

                subMenuRefs.current[`main-${index}`] = el;

              }}

              className="overflow-hidden transition-all duration-300"

              style={{

                height:

                  openSubmenu === index

                    ? `${subMenuHeight[`main-${index}`]}px`

                    : "0px",

              }}

            >

              <ul className="mt-2 ml-9 space-y-1">

                {nav.subItems.map((subItem) => {

                  const itemActive = isActive(subItem.path);

                  return (

                    <li key={subItem.name}>

                      <Link

                        to={subItem.path}

                        className={`menu-dropdown-item ${

                          itemActive

                            ? "menu-dropdown-item-active"

                            : "menu-dropdown-item-inactive"

                        }`}

                      >

                        {subItem.name}

                      </Link>

                    </li>

                  );

                })}

              </ul>

            </div>

          )}

        </li>

      ))}

    </ul>

  );



  return (

    <aside

      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:mt-0 ${

        isExpanded || isMobileOpen

          ? "w-[290px]"

          : isHovered

            ? "w-[290px]"

            : "w-[90px]"

      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}

      onMouseEnter={() => !isExpanded && setIsHovered(true)}

      onMouseLeave={() => setIsHovered(false)}

    >

      <div

        className={`flex py-8 ${

          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"

        }`}

      >

        <Link to={homePath}>

          {isExpanded || isHovered || isMobileOpen ? (

            <div>

              <h2 className="text-2xl font-bold text-[var(--color-brand-400)]">

                Gleen Star

              </h2>

              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gray-400">

                {module === "mlm" ? "MLM Control" : "Shopping"}

              </p>

            </div>

          ) : (

            <h2 className="text-2xl font-bold text-[var(--color-brand-400)]">

              GS

            </h2>

          )}

        </Link>

      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">

        <nav className="mb-6">

          <div className="flex flex-col gap-4">

            <div>

              <h2

                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${

                  !isExpanded && !isHovered

                    ? "lg:justify-center"

                    : "justify-start"

                }`}

              >

                {isExpanded || isHovered || isMobileOpen ? (

                  module === "mlm" ? "MLM Menu" : "Menu"

                ) : (

                  <HorizontaLDots className="size-6" />

                )}

              </h2>

              {renderMenuItems(navItems)}

            </div>

          </div>

        </nav>

      </div>

    </aside>

  );

};



export default AppSidebar;

