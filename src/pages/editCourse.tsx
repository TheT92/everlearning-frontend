import { Button, Checkbox, Form, Input, message, Radio, type FormProps } from 'antd';
import { useEffect, useRef, useState } from 'react';

import '../styles/editCourse.scss';
import TextArea from 'antd/es/input/TextArea';
import { apiGetCategories } from '../apis/category';
import { apiAddCourse } from '../apis/course';
import { useNavigate } from 'react-router-dom';
type FieldType = {
    title: string;
    categoriesArr: string[];
    content: string;
    courseType: number;
    categories?: string;
};

const courseTypes = [
    { value: 1, label: 'Text' },
    { value: 2, label: 'Video' }
]

const initialValues = { title: '', difficulty: 1, categoriesArr: [], courseType: 1, content: '' };

export default function EditCourse() {
    const navigate = useNavigate();

    const loaded = useRef(false);
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState<FieldType>(initialValues);

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        values.categories = values.categoriesArr.join(',');
        console.log('Success:', values);

        apiAddCourse(values).then(res => {
            console.log("success", res)
            message.success("Add course successfully!")
            navigate('/courses', { replace: true });
        }).catch(err => {
            console.log("error", err)
            message.error("Add course failed");
        })
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const fetchData = () => {
        apiGetCategories().then(res => {
            setCategories(res.data?.data)
        }).catch(err => {
            console.log("error", err)
        })
    }

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            fetchData();
        }
    }, [])

    return (
        <div className="page-container edit-course">
            <div className="course-detail">
                <Form
                    name="basic"
                    form={form}
                    labelAlign="right"
                    initialValues={initialValues}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        name="title"
                        className="mb-2"
                        rules={[{ required: true, message: 'Please enter title' }]}
                    >
                        <Input className='course-title fs-2' placeholder='Enter title here' allowClear variant="underlined" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Course Type"
                        name="courseType"
                        className="mb-2"
                        rules={[{ required: true, message: 'Please choose type' }]}
                    >
                        <Radio.Group
                            value={formData.courseType}
                            options={courseTypes}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Categories"
                        name="categoriesArr"
                        className="mb-2"
                        rules={[{ required: true, message: 'Please choose Categories' }]}
                    >
                        <Checkbox.Group options={categories.map((v: any) => v.name)} value={formData.categoriesArr}></Checkbox.Group>
                    </Form.Item>
                    <Form.Item<FieldType>
                        label={null}
                        name="content"
                        className="mb-4"
                        rules={[{ required: true, message: 'Please enter content' }]}
                    >
                        <TextArea showCount rows={20} placeholder='Enter content here'></TextArea>
                    </Form.Item>
                    <Form.Item label={null} className="mb-4">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}