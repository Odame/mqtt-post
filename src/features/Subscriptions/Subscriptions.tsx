import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, message } from 'antd';
import { List, Modal } from 'antd';
import React, {
	FunctionComponent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useSelectedConnectionId } from '../../context/currConnId';
import { MqttClientState, useMqttClientState } from '../../context/mqttClients';
import { getDatabase } from '../../db';
import { ISavedSubscription } from '../../db/schemas/subscription';
import './Subscriptions.css';

type AddNewSubscriptionProps = {
	visible: boolean;
	onComplete: () => void;
};
const AddNewSubscription: FunctionComponent<AddNewSubscriptionProps> = (
	props
) => {
	return (
		<Modal
			title="Add New Subscription"
			visible={props.visible}
			onCancel={props.onComplete}
			onOk={props.onComplete}
		>
			This is the modal's content
		</Modal>
	);
};

export default function Subscriptions() {
	const selectedConnectionId = useSelectedConnectionId();
	const { clientState } = useMqttClientState(selectedConnectionId);

	const [subscriptions, setSubscription] = useState<Array<ISavedSubscription>>(
		[]
	);
	useEffect(() => {
		const rxSubscription = getDatabase()
			.subscriptions.getSavedSubscriptions$(selectedConnectionId || '')
			.subscribe(setSubscription);
		return () => rxSubscription.unsubscribe();
	}, [selectedConnectionId]);

	const [isModalVisible, setModalVisible] = useState(false);
	const hideModal = useCallback(() => setModalVisible(false), []);
	const onClickAddSubscription = () => {
		if (clientState !== MqttClientState.connected) {
			message.error({
				content: 'Not connected!',
				key: 'add-new-subscription-error',
				duration: 1,
			});
		} else setModalVisible(true);
	};
	return (
		<>
			<AddNewSubscription visible={isModalVisible} onComplete={hideModal} />
			<Card
				className="fill-width fill-height subscriptions"
				type="inner"
				title="Subscriptions"
				extra={
					<Button
						type="link"
						shape="circle-outline"
						icon={<PlusOutlined style={{ fontSize: '22px' }} />}
						onClick={onClickAddSubscription}
					/>
				}
				size="small"
			>
				{subscriptions.length === 0 ? (
					<div className="fill-height fill-width center-children">
						<span>No subscriptions on this connection yet</span>
					</div>
				) : (
					<List
						itemLayout="horizontal"
						dataSource={subscriptions}
						rowKey={(subscription) => subscription.id}
						renderItem={(subscription) => subscription.topic}
					/>
				)}
			</Card>
		</>
	);
}
