'use client';

import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface EditorTourProps {
    run: boolean;
    onFinish: () => void;
}

export default function EditorTour({ run, onFinish }: EditorTourProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const steps: Step[] = [
        {
            target: 'body',
            content: (
                <div>
                    <h2 style={{ margin: '0 0 8px', fontSize: 18, color: '#f0f0f5' }}>Welcome to G3 Engine! 🚀</h2>
                    <p style={{ margin: 0, color: '#a1a1aa', fontSize: 14 }}>
                        Let's take a quick tour to help you build your first game. This will only take a minute.
                    </p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '.editor-left-panel',
            content: (
                <div>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#f0f0f5' }}>Scene Graph</h3>
                    <p style={{ margin: 0, color: '#a1a1aa', fontSize: 14 }}>
                        View and manage all objects in your 3D world here. Select, rename, toggle visibility or delete items.
                    </p>
                </div>
            ),
            placement: 'right',
        },
        {
            target: '.editor-bottom-panel',
            content: (
                <div>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#f0f0f5' }}>Assets & Logic</h3>
                    <p style={{ margin: 0, color: '#a1a1aa', fontSize: 14 }}>
                        Drag and drop 3D primitives (like boxes and lights) into your scene from <b>Assets</b>. Switch to the <b>Logic</b> tab to connect nodes and build your game's visual scripting!
                    </p>
                </div>
            ),
            placement: 'top',
        },
        {
            target: '.editor-right-panel',
            content: (
                <div>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#f0f0f5' }}>Properties Inspector</h3>
                    <p style={{ margin: 0, color: '#a1a1aa', fontSize: 14 }}>
                        When you select an item in the scene, its Transform (position, rotation, scale) and Material properties will appear here for precise tweaking.
                    </p>
                </div>
            ),
            placement: 'left',
        },
        {
            target: '.tour-play-btn',
            content: (
                <div>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#f0f0f5' }}>Play Your Game</h3>
                    <p style={{ margin: 0, color: '#a1a1aa', fontSize: 14 }}>
                        Click here to jump into Play mode and test your game in real-time. Hit ESC to exit when you're done.
                    </p>
                </div>
            ),
            placement: 'bottom',
        },
        {
            target: '.tour-publish-btn',
            content: (
                <div>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#f0f0f5' }}>Publish & Share</h3>
                    <p style={{ margin: 0, color: '#a1a1aa', fontSize: 14 }}>
                        Ready to launch? Publish your game directly to the Web, Telegram, or as a Twitter Player Card!
                    </p>
                </div>
            ),
            placement: 'bottom',
        }
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            onFinish();
        }
    };

    if (!isMounted) return null;

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#8b5cf6',
                    backgroundColor: '#13131d',
                    textColor: '#f0f0f5',
                    arrowColor: '#13131d',
                    overlayColor: 'rgba(0, 0, 0, 0.65)',
                },
                tooltipContainer: {
                    textAlign: 'left' as const,
                },
                buttonNext: {
                    backgroundColor: 'rgba(139,92,246,0.2)',
                    color: '#a78bfa',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontWeight: 600,
                },
                buttonBack: {
                    color: '#7a7f8d',
                    marginRight: 10,
                },
                buttonSkip: {
                    color: '#5a5f6d',
                }
            }}
        />
    );
}
