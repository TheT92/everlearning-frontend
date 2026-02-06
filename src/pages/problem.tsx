import { useNavigate, useParams } from "react-router-dom";
import {
    useEffect,
    useRef,
    useState,
    type TouchEvent as ReactTouchEvent,
} from "react";
import {
    apiGetProblemDetail,
    apiRecordReview,
    apiGetReviewStatus,
    apiGetFavoriteStatus,
    apiToggleFavorite,
} from "../apis/problem";
import { Button } from "antd";
import {
    LeftOutlined,
    RightOutlined,
    HeartOutlined,
    HeartFilled,
} from '@ant-design/icons';

import '../styles/problem-detail.scss';

type ReviewStatus = 'known' | 'unknown';

export default function Problem() {
    const navigate = useNavigate();
    const { uuid = '' } = useParams();
    const [problem, setProblem] = useState<any>({});
    const [showAnswer, setShowAnswer] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [statusMap, setStatusMap] = useState<Record<string, ReviewStatus | undefined>>({});
    const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});

    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const hasDraggedRef = useRef(false);

    const currentStatus = uuid ? statusMap[uuid] : undefined;
    const isFavorite = uuid ? !!favoriteMap[uuid] : false;

    useEffect(() => {
        apiGetReviewStatus()
            .then(res => {
                const data = res.data?.data ?? {};
                const sanitized: Record<string, ReviewStatus> = {};
                Object.entries(data).forEach(([key, value]) => {
                    sanitized[key] = value === true ? 'known' : 'unknown';
                });
                setStatusMap(sanitized);
            })
            .catch(e => console.error('Failed to load review status', e));

        apiGetFavoriteStatus()
            .then(res => {
                const data = res.data?.data ?? {};
                const sanitized: Record<string, boolean> = {};
                Object.entries(data).forEach(([key, value]) => {
                    sanitized[key] = Boolean(value);
                });
                setFavoriteMap(sanitized);
            })
            .catch(e => console.error('Failed to load favorite status', e));
    }, []);

    useEffect(() => {
        fetchData();
        setShowAnswer(false);
        setDragX(0);
    }, [uuid]);

    const fetchData = () => {
        apiGetProblemDetail(uuid).then(res => {
            setProblem({ ...res.data })
        }).catch(err => {
            console.error(err);
        })
    };

    const toogleProblem = (id: string) => {
        navigate(`/problem/${id}`);
    }

    const toggleFavorite = () => {
        if (!uuid) return;
        const next = !isFavorite;
        setFavoriteMap(prev => ({
            ...prev,
            [uuid]: next,
        }));
        apiToggleFavorite(uuid, next).catch(e => {
            console.error('Failed to toggle favorite', e);
            // rollback on error
            setFavoriteMap(prev => ({
                ...prev,
                [uuid]: !next,
            }));
        });
    };

    const handleChoice = (status: ReviewStatus, options?: { goNext?: boolean }) => {
        if (!uuid) return;
        const remembered = status === 'known';
        apiRecordReview(uuid, remembered).catch(e => console.error('Failed to record review', e));
        setStatusMap(prev => ({
            ...prev,
            [uuid]: status,
        }));
        setShowAnswer(true);
        setDragX(0);

        if (options?.goNext && problem?.next_id) {
            toogleProblem(problem.next_id);
        }
    };

    const finishDrag = () => {
        const threshold = 100;
        if (dragX > threshold) {
            // 右滑：记住了，并跳到下一题
            handleChoice('known', { goNext: true });
        } else if (dragX < -threshold) {
            // 左滑：没记住，并跳到下一题
            handleChoice('unknown', { goNext: true });
        }
        setDragX(0);
        isDraggingRef.current = false;
        hasDraggedRef.current = false;
    };

    const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
        if (e.touches.length !== 1) return;
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        startXRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - startXRef.current;
        setDragX(deltaX);
        if (Math.abs(deltaX) > 5) {
            hasDraggedRef.current = true;
        }
    };

    const handleTouchEnd = () => {
        if (!isDraggingRef.current) return;
        finishDrag();
    };

    const handleCardClick = () => {
        if (hasDraggedRef.current) return;
        setShowAnswer(prev => !prev);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!uuid) return;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleChoice('unknown', { goNext: true });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleChoice('known', { goNext: true });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [uuid, problem?.next_id]);

    return (
        <div className="page-container problem-detail flex-column">
            <div
                className={`flashcard flex-1 mb-6 ${showAnswer ? 'is-flipped' : ''} ${dragX !== 0 ? 'is-dragging' : ''}`}
                onClick={handleCardClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)`,
                }}
            >
                <div className="flashcard-inner">
                    <div className="flashcard-face flashcard-front">
                        <h3 className="mt-0 mb-2">Question</h3>
                        <h2 className="problem-title mt-0 mb-2">{problem.title}</h2>
                        <p className="pre-wrap mt-0 mb-2">{problem.description}</p>
                    </div>
                    <div className="flashcard-face flashcard-back">
                        <h3 className="mt-0 mb-2">Answer</h3>
                        <p className="pre-wrap">{problem.answer}</p>
                    </div>
                </div>
            </div>
            <div className="d-flex">
                <div className="flashcard-actions flex-1 mr-6">
                    <Button
                        className="flashcard-action-btn flashcard-action-unknown"
                        onClick={() => handleChoice('unknown', { goNext: true })}
                    >
                        Forgot
                    </Button>
                    <Button
                        className="flashcard-action-btn flashcard-action-known"
                        type="primary"
                        onClick={() => handleChoice('known', { goNext: true })}
                    >
                        Remembered
                    </Button>
                </div>
                <div className="problem-header d-flex justify-between align-center">
                    <div className="problem-nav-buttons">
                        <Button
                            onClick={() => toogleProblem(problem.prev_id)}
                            disabled={problem.prev_id == null || problem.prev_id === undefined}
                            className="mr-4"
                        >
                            <LeftOutlined />
                        </Button>
                        <Button
                            onClick={() => toogleProblem(problem.next_id)}
                            disabled={problem.next_id == null || problem.next_id === undefined}
                        >
                            <RightOutlined />
                        </Button>
                        <Button
                            className={`ml-4 favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
                            shape="circle"
                            type={isFavorite ? "primary" : "default"}
                            onClick={toggleFavorite}
                            icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                        />
                    </div>
                </div>
            </div>
            <p className="flashcard-hint">
                Tap the card to flip between question and answer.<br/>
                On mobile, swipe right to mark as "Remembered" or swipe left to mark as "Not remembered" and automatically move to the next problem.
            </p>
        </div>
    );
}