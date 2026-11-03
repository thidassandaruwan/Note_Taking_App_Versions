import { Link, useLocation } from "react-router";
import { MoonIcon, PlusIcon, SunIcon } from "lucide-react";

const Navbar = ({themeOptions, theme, setTheme}) => {

    const switchTheme = async () => {
        const newTheme = (theme === themeOptions.lightTheme)? themeOptions.darkTheme : themeOptions.lightTheme;
        setTheme(newTheme);
    };
    // used for deciding theme switcher button icon
    const isLight = (theme === themeOptions.lightTheme)
    // used to hide new note button on other pages than home page
    const isHomePage = ("/" === useLocation().pathname);

  return (
    <header className="big-base-300 border-b border-base-content/10">
        <div className="mx-auto max-w-6xl p-4">
            <div className="flex items-center justify-between">
                <Link to={"/"}>
                    <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">
                        Thinkboard 
                    </h1>
                </Link>
                <div className="flex items-center gap-6">
                    {isHomePage && <div className="flex items-center gap-4">
                        <Link to={"/create"} className="btn btn-primary">
                            <PlusIcon className="size-5"/>
                            <span> New Note </span>
                        </Link>
                    </div>}
                    <div className="flex items-center gap-4">
                        <button onClick={switchTheme} className="btn btn-ghost">
                            {(isLight) ? <MoonIcon className="size-5"/> : <SunIcon className="size-5"/>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Navbar