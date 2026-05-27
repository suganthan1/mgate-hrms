const Sidebar = ({

  activePage,

  setActivePage,

  userRole,

  logo,

}) => {

  return (

    <div className="w-64 bg-white shadow-xl p-6 flex flex-col">

      <div className="flex flex-col items-center mb-10">

        <img
          src={logo}
          alt="logo"
          className="w-24 h-24 object-contain"
        />

      </div>

    </div>

  );

};

export default Sidebar;