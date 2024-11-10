import CreateItemsModal from './components/share/createItemsModal';
import CreateGroupModal from './components/share/createGroupModal';
import Timeline from './components/home/Timeline';

const HomePage = () => {
  return (
    <div className='space-y-10'>
      <div>
        <CreateItemsModal/> <CreateGroupModal/>
      </div>
      <div>
        <Timeline />
      </div>
      <div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque delectus eius amet eveniet, aut perferendis optio autem nesciunt voluptates ut blanditiis. Accusantium error delectus qui doloribus eius architecto. Fuga, numquam.</p>
      </div>
    </div>
  );
};

export default HomePage;