// test-sentinel.js - Simple check for Redis Sentinel
import Redis from 'ioredis';

export async function testSentinel() {
  console.log('\n🔍 Checking Redis Sentinel...\n');
  
  const redis = new Redis({
    sentinels: [
      { host: 'localhost', port: 26379 },
      { host: 'localhost', port: 26380 },
      { host: 'localhost', port: 26381 },
    ],
    name: 'mymaster',
    connectTimeout: 5000, // 5 second timeout
  });
  
  redis.on('ready', async () => {
    console.log('✅ Connected to Redis Sentinel\n');
    
    try {
      // Save
      await redis.set('test', 'working');
      console.log('✅ Saved data');
      
      // Get
      const value = await redis.get('test');
      console.log(`✅ Got data: ${value}`);
      
      // Delete
      await redis.del('test');
      console.log('✅ Deleted data');
      
      // Master info
      const master:any = await redis.call('SENTINEL', 'get-master-addr-by-name', 'mymaster');
      console.log(`✅ Master: ${master[0]}:${master[1]}`);
      
      console.log('\n🎉 Redis Sentinel is WORKING!\n');
      
    } catch (error:any) {
      console.log('⚠️ Test error:', error.message);
    } finally {
      redis.quit();
    }
  });
  
  redis.on('error', (error) => {
    console.log('⚠️ Sentinel not available:', error.message);
    console.log('💡 App will continue without Sentinel\n');
    redis.disconnect();
    // ❌ REMOVED: process.exit(1)
  });
}