import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
// import { checkIOS, checkMacOS } from '@devclad/lib';
import Link from 'next/link';
import CTA from '@/components/CTA';

// network, build, and ship
// function NBS(): JSX.Element {
// 	return (
// 		<div className="flex justify-center text-center">
// 			<div
// 				className="space-y-4 rounded-xl border-[1px] border-neutral-800 bg-black p-3
//          shadow-2xl shadow-orange-900/20 duration-1000 hover:border-neutral-400 sm:max-w-prose"
// 			>
// 				<h2 className="space-x-4 text-4xl sm:text-6xl md:text-5xl xl:text-6xl">
// 					<span aria-label="Network">🤝</span>
// 					<span aria-label="Build">🛠️</span>
// 					<span aria-label="Ship">🚀</span>
// 				</h2>
// 			</div>
// 		</div>
// 	);
// }

export default function Hero(): JSX.Element {
	// const [isIOSMacOS, setIsIOSMacOS] = React.useState(false);

	// React.useEffect(() => {
	// 	setIsIOSMacOS(checkIOS() || checkMacOS());
	// }, []);

	return (
		<div className="lg:overflow-hidden">
			<div className="mx-auto max-w-full">
				<div className="relative">
					<div className="z-10 mx-auto px-4 sm:px-6 sm:text-center lg:items-center">
						<div className="lg:py-24">
							<h1 className="mt-5 text-5xl font-black tracking-tighter text-white lg:-mt-20">
								DevClad
								<span className="text-base font-medium tracking-normal text-orange-500">
									beta
								</span>
							</h1>

							<span className="mb-2 flex sm:justify-center">
								<h1 className="font-monoNext mt-1 w-fit text-xl font-bold text-orange-50">
									<span className="flex sm:block md:block lg:block">
										<span>Network.</span>
										<span className="ml-2">Build.</span>
										<span className="ml-2">Ship.</span>
									</span>
								</h1>
							</span>
							<span className="mb-2 mt-2 flex sm:justify-center">
								<Link
									href="https://github.com/devclad-inc/devclad/"
									target="_blank"
									className="inline-flex items-center rounded-lg border-[1px] border-neutral-800 bg-black
               p-1 pr-2 sm:rounded-full sm:text-base lg:text-sm xl:text-base"
									rel="noreferrer"
								>
									<span className="ml-4">
										<svg
											className="mr-2 h-6 w-4 sm:h-8 sm:w-5"
											aria-hidden="true"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
												clipRule="evenodd"
											/>
										</svg>
									</span>
									<span className=" text-xs lg:text-sm">
										Open-Source on GitHub
									</span>
									<ChevronRightIcon
										className="ml-2 h-5 w-5 text-neutral-500"
										aria-hidden="true"
									/>
								</Link>
							</span>
							<span className="mb-10 flex sm:ml-4 sm:justify-center ">
								<Link
									href="https://discord.com/invite/Cu5UgbgPjQ"
									target="_blank"
									className="inline-flex items-center rounded-lg  border-[1px] border-neutral-800 bg-black p-1
               pr-2 sm:mt-0 sm:rounded-full sm:text-base lg:text-sm xl:text-base"
									rel="noreferrer"
								>
									<svg
										className="mr-2 ml-2 h-6 w-4 sm:h-6 sm:w-6"
										fill="currentColor"
										xmlns="http://www.w3.org/2000/svg"
										fillRule="evenodd"
										clipRule="evenodd"
										viewBox="0 0 24 24"
									>
										<path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm3.248 18.348l-.371-1.295.896.833.847.784 1.505 1.33v-12.558c0-.798-.644-1.442-1.435-1.442h-9.38c-.791 0-1.435.644-1.435 1.442v9.464c0 .798.644 1.442 1.435 1.442h7.938zm-1.26-3.206l-.462-.567c.917-.259 1.267-.833 1.267-.833-.287.189-.56.322-.805.413-.35.147-.686.245-1.015.301-.672.126-1.288.091-1.813-.007-.399-.077-.742-.189-1.029-.301-.161-.063-.336-.14-.511-.238l-.028-.016-.007-.003-.028-.016-.028-.021-.196-.119s.336.56 1.225.826l-.469.581c-1.547-.049-2.135-1.064-2.135-1.064 0-2.254 1.008-4.081 1.008-4.081 1.008-.756 1.967-.735 1.967-.735l.07.084c-1.26.364-1.841.917-1.841.917l.413-.203c.749-.329 1.344-.42 1.589-.441l.119-.014c.427-.056.91-.07 1.414-.014.665.077 1.379.273 2.107.672 0 0-.553-.525-1.743-.889l.098-.112s.959-.021 1.967.735c0 0 1.008 1.827 1.008 4.081 0 0-.573.977-2.142 1.064zm-.7-3.269c-.399 0-.714.35-.714.777 0 .427.322.777.714.777.399 0 .714-.35.714-.777 0-.427-.315-.777-.714-.777zm-2.555 0c-.399 0-.714.35-.714.777 0 .427.322.777.714.777.399 0 .714-.35.714-.777.007-.427-.315-.777-.714-.777z" />
									</svg>
									<span className="text-xs lg:text-sm">Join our Discord</span>
									<ChevronRightIcon
										className="ml-2 h-5 w-5 text-neutral-500"
										aria-hidden="true"
									/>
								</Link>
							</span>

							<div className="space-y-4">
								<div className="flex text-center sm:justify-center">
									<div
										className="w-full rounded-xl border-[1px] border-neutral-800 bg-black/5 p-6
                 shadow-2xl shadow-sky-500/10 md:w-3/4 lg:max-w-prose"
									>
										<h1 className="text-5xl text-[#fff] sm:text-6xl sm:font-medium md:text-6xl lg:text-6xl xl:text-7xl">
											<span className="block font-bold">
												<span className="block">Meet developers</span>
												<span className="block rounded-xl text-orange-100">
													one-on-one
												</span>
											</span>
											<span className="font-bold text-fuchsia-100">
												Team up.
											</span>
											<span className="font-bold text-sky-100"> Build.</span>
										</h1>
									</div>
								</div>
								{/* {isIOSMacOS && <NBS />} */}
							</div>
							<CTA />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
