import React, {useState, useEffect, useRef, useMemo} from 'react'
import { render } from 'react-dom';
import ReactFlow from 'reactflow';
import { Handle, Position } from 'reactflow';

const Flow = ({nodes, edges, blockLabelToIdMap, activateBlock}) => {
    const renderNode = ({data}) => {
        console.log({data})
        const isMiddle = !data?.data
        if(isMiddle) {
            return (
                <>
                    <Handle type="source" id={`${data?.label}-t`} position={Position.Top} />
                    <Handle type="source" id={`${data?.label}-b`} position={Position.Bottom} />
                    <Handle type="source" id={`${data?.label}-l`} position={Position.Left} />
                    <Handle type="source" id={`${data?.label}-r`} position={Position.Right} />
                    <div className='flow__item-container'>
                        <div className='flow__title'>{data?.label}</div>
                    </div>
                </>
            )
        }

        return (
            <>
                <Handle type="target" id={`${data?.label}-t`} position={Position.Top} />
                <Handle type="target" id={`${data?.label}-b`} position={Position.Bottom} />
                <Handle type="target" id={`${data?.label}-l`} position={Position.Left} />
                <Handle type="target" id={`${data?.label}-r`} position={Position.Right} />
                <div 
                    className='flow__item-container'
                    onClick={activateBlock(blockLabelToIdMap[data?.label])}
                >
                    {data?.data?.map((item, itemIndex) => (
                        <div 
                            className={`flow__subitem-container${itemIndex !== data?.data?.length - 1 ? ' flow__subitem-container--spaced' : ''}`}
                            key={`item-${itemIndex}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </>
        )
    }

    const nodeTypes = useMemo(() => ({custom: renderNode}), []);

    return (
        <div
            className="flow__container"
            style={{ width: '100vw' }}
        >
            <ReactFlow 
                nodes={nodes} 
                edges={edges}
                nodeTypes={nodeTypes}
            />
        </div>
    )
}

export default Flow