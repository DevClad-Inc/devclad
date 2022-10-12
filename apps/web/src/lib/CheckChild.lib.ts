export const CheckChild = (pathname: string, href: string) => {
	if (pathname === href || `${pathname}/` === href) {
		return true;
	}
	if (pathname.startsWith(href) && href !== '/') {
		return true;
	}
	return false;
};

export default CheckChild;
