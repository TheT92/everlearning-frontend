import { Card, Pagination, Progress, Table, type TableProps, Image, Button, Modal, Form, Input, message } from "antd";
import { useEffect, useState, useCallback } from "react";
import {
    apiUserLogout,
    apiGetFavoriteProblems,
    apiGetUserProfile,
    apiGetUserStats,
    apiGetUserActivities,
    apiUpdateProfile,
} from "../apis/user";
import { Link } from "react-router-dom";

function formatDate(s: string) {
    if (!s) return "";
    const d = new Date(s);
    return d.toLocaleDateString();
}

interface DataType {
    uuid: string;
    title: string;
    create_time: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`/problem/${(record as DataType).uuid}`}>{text}</Link>,
    },
    {
        title: 'Create Time',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 200,
        render: (text) => <span>{formatDate(text)}</span>,
    },
];

interface Stats {
    easy: { total: number; reviewed: number };
    middle: { total: number; reviewed: number };
    hard: { total: number; reviewed: number };
}
interface Activity {
    problem_uuid: string;
    title: string;
    remembered: boolean;
    create_time: string;
}

export default function UserCenter() {
    const [favoriteList, setFavoriteList] = useState<DataType[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [profile, setProfile] = useState<{ username?: string; email?: string }>({});
    const [stats, setStats] = useState<Stats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const pageSize = 10;

    const fetchFavorites = useCallback((page: number) => {
        apiGetFavoriteProblems(page, pageSize)
            .then(res => {
                const data = res.data?.data ?? {};
                setFavoriteList(data.list ?? []);
                setTotal(data.total ?? 0);
            })
            .catch(err => console.error('Failed to load favorite problems', err));
    }, []);

    const fetchProfile = useCallback(() => {
        apiGetUserProfile()
            .then(res => setProfile(res.data?.data ?? {}))
            .catch(err => console.error('Failed to load profile', err));
    }, []);

    const [problemsSolved, setProblemsSolved] = useState(0);
    const fetchStats = useCallback(() => {
        apiGetUserStats()
            .then(res => {
                const d = res.data?.data;
                if (d) {
                    setProblemsSolved(d.problemsSolved ?? 0);
                    setStats(d?.byDifficulty ? {
                        easy: d.byDifficulty.easy || { total: 0, reviewed: 0 },
                        middle: d.byDifficulty.middle || { total: 0, reviewed: 0 },
                        hard: d.byDifficulty.hard || { total: 0, reviewed: 0 },
                    } : null);
                }
            })
            .catch(err => console.error('Failed to load stats', err));
    }, []);

    const fetchActivities = useCallback(() => {
        apiGetUserActivities(10)
            .then(res => setActivities(res.data?.data ?? []))
            .catch(err => console.error('Failed to load activities', err));
    }, []);

    useEffect(() => {
        fetchFavorites(currentPage);
    }, [currentPage, fetchFavorites]);

    useEffect(() => {
        fetchProfile();
        fetchStats();
        fetchActivities();
    }, [fetchProfile, fetchStats, fetchActivities]);

    const onPageChange = (page: number) => setCurrentPage(page);

    const handleLogout = () => apiUserLogout();

    const handleEditProfile = () => {
        form.setFieldsValue({ username: profile.username });
        setEditModalVisible(true);
    };

    const handleSaveProfile = async () => {
        try {
            const values = await form.validateFields();
            await apiUpdateProfile(values.username);
            message.success('Profile updated');
            setEditModalVisible(false);
            fetchProfile();
        } catch (e) {
            if (e?.errorFields) return;
            message.error('Update failed');
        }
    };

    return (
        <div className="page-container user-center responsive-flex">
            <div className="mr-4 flex-5">
                <div className="responsive-flex mb-4">
                    <Card className="mr-4 flex-1" size="small">
                        {stats && (
                            <>
                                <p className="mt-0 mb-0 fw-5 text-green">
                                    Easy: {stats.easy.reviewed}/{stats.easy.total}
                                </p>
                                <Progress className="mb-2" strokeLinecap="butt" percent={stats.easy.total ? Math.round((stats.easy.reviewed / stats.easy.total) * 100) : 0} showInfo={false} strokeColor="#49aa19" />
                                <p className="mt-0 mb-0 fw-5 text-orange">
                                    Middle: {stats.middle.reviewed}/{stats.middle.total}
                                </p>
                                <Progress className="mb-2" strokeLinecap="butt" percent={stats.middle.total ? Math.round((stats.middle.reviewed / stats.middle.total) * 100) : 0} showInfo={false} strokeColor="#ffb700" />
                                <p className="mt-0 mb-0 fw-5 text-red">
                                    Hard: {stats.hard.reviewed}/{stats.hard.total}
                                </p>
                                <Progress className="mb-2" strokeLinecap="butt" percent={stats.hard.total ? Math.round((stats.hard.reviewed / stats.hard.total) * 100) : 0} showInfo={false} strokeColor="#dc4446" />
                            </>
                        )}
                    </Card>
                    <Card className="flex-1 flex-column align-center justify-center">
                        <p className="fs-6 mt-0 mb-1 text-center fw-5">{problemsSolved}</p>
                        <p className="fs-1 mt-0 mb-0 text-center">Problems Solved</p>
                    </Card>
                </div>
                <Card className="full-width mb-4" size="small">
                    <h3 className="mt-0">Recent Activities</h3>
                    {activities.length === 0 ? (
                        <p className="mt-0 mb-0" style={{ color: '#999' }}>No activities yet</p>
                    ) : (
                        <ul className="pl-4 mt-0 mb-0" style={{ listStyle: 'none', paddingLeft: '1rem' }}>
                            {activities.map((a, i) => (
                                <li key={i} className="mb-2">
                                    <Link to={`/problem/${a.problem_uuid}`}>{a.title}</Link>
                                    <span className="ml-2" style={{ color: '#999' }}>{a.remembered ? '✓ Remembered' : '✗ Forgot'}</span>
                                    <span className="ml-2" style={{ color: '#999' }}>{formatDate(a.create_time)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card className="full-width mb-4" size="small">
                    <h3 className="mt-0">Favorite Problems</h3>
                    <Table<DataType>
                        columns={columns}
                        dataSource={favoriteList}
                        pagination={false}
                        className="mb-4"
                        rowKey="uuid"
                        showHeader={false}
                    />
                    {total > 0 && (
                        <Pagination onChange={onPageChange} defaultCurrent={1} current={currentPage} total={total} pageSize={pageSize} />
                    )}
                </Card>
            </div>
            <Card className="flex-2" size="small">
                <div className="d-flex mb-4">
                    <Image
                        alt="basic image"
                        width={80}
                        height={80}
                        src="error"
                        fallback="data:image/png;base64,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"
                    />
                    <div className="pl-2 flex-1">
                        <p className="mt-0 fw-5">{profile.username || "User"}</p>
                        <p className="mt-0 mb-0 fs-1" style={{ color: '#999' }}>{profile.email}</p>
                    </div>
                </div>
                <Button className="full-width mb-4" type="primary" onClick={handleEditProfile}>Edit Profile</Button>
                <Button className="full-width" danger onClick={handleLogout}>Logout</Button>
            </Card>
            <Modal
                title="Edit Profile"
                open={editModalVisible}
                onOk={handleSaveProfile}
                onCancel={() => setEditModalVisible(false)}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}