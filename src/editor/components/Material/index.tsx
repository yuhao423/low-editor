import {PageTabs} from './components/PageTabs'
import PageTree from './components/PageTree'
export const Material = () => {
    return (
        <div className="w-full h-full flex flex-col bg-white border-r">
            <PageTabs />
            <div className="flex-1 overflow-auto">
                <PageTree></PageTree>
                {/* <ComponentTree /> */}
                {/* 后续可在此追加物料面板 MaterialPanel */}
            </div>
        </div>
    );
}