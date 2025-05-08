import * as autocannon from 'autocannon';

async function run() {
  const instance = autocannon(
    {
      url: 'http://localhost:3000/product', // الـ URL الخاص بالـ API
      method: 'GET',
      connections: 300, // عدد الاتصالات المتزامنة
      duration: 15, // مدة الاختبار بالثواني
    },
    finished,
  );

  autocannon.track(instance, { renderProgressBar: true });

  function finished(err: any, result: any) {
    if (err) {
      console.error('❌ Error:', err);
    } else {
      console.log('✅ Test completed successfully');
      console.log(result);
    }
  }
}

run();
