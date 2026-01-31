import * as React from 'react';
import Video from 'react-native-video';
import NetInfo from '@react-native-community/netinfo';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setIsFullScreenVideoPlayer} from '../../app/reducers/liveStreamStore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '@gluestack-ui/themed';
import {MaximizeIcon, MinimizeIcon} from 'lucide-react-native';

export const CloudflareStreamPlayer = props => {
  const {videoUrl, maxRetries = 5, retryDelay = 2000} = props;
  const videoRef = React.useRef(null);
  const [playerKey, setPlayerKey] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const [isConnected, setIsConnected] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const isFocused = useIsFocused();
  const retryTimeoutRef = React.useRef(null);
  const savedTimeRef = React.useRef(0);
  const [fullscreen, setFullscreen] = React.useState(false);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const retryCountRef = React.useRef(0);

  // Monitorear estado de la red
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasDisconnected = !isConnected;
      setIsConnected(state.isConnected);

      // Si recuperamos la conexión, intentar reconectar
      if (wasDisconnected && state.isConnected && error) {
        console.log('Conexión recuperada, reintentando...');
        handleRetry();
      }
    });

    return () => {
      unsubscribe();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [isConnected, error]);

  // Manejar progreso del video
  const onProgress = React.useCallback(data => {
    setCurrentTime(data.currentTime);
    savedTimeRef.current = data.currentTime;
  }, []);

  // Manejar estado de buffer
  const onBuffer = React.useCallback(({isBuffering: buffering}) => {
    setIsBuffering(buffering);
  }, []);

  // Manejar carga exitosa
  const onLoad = React.useCallback(data => {
    console.log('Video cargado:', data.duration);
    setError(null);
    setRetryCount(0);

    // Restaurar posición si estábamos reconectando
    if (savedTimeRef.current > 0 && videoRef.current) {
      videoRef.current.seek(savedTimeRef.current);
    }
  }, []);

  // Manejar errores
  const onError = React.useCallback(
    err => {
      console.log('Error de video:', err);
      setError(err);
      // Guardar tiempo actual antes de reintentar
      savedTimeRef.current = currentTime;

      // Intentar reconexión automática si no hemos excedido el límite
      if (retryCount < maxRetries && isConnected) {
        scheduleRetry();
      }
    },
    [retryCount, maxRetries, isConnected, currentTime],
  );

  // Programar reintento con backoff exponencial
  const scheduleRetry = React.useCallback(() => {
    const delay = retryDelay * Math.pow(2, retryCount);
    console.log(
      `Reintentando en ${delay}ms (intento ${retryCount + 1}/${maxRetries})`,
    );

    retryTimeoutRef.current = setTimeout(() => {
      handleRetry();
    }, delay);
  }, [retryCount, retryDelay, maxRetries]);

  // Ejecutar reintento
  const handleRetry = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
    // Cambiar key fuerza recreación del componente Video
    setPlayerKey(prev => prev + 1);
  }, []);

  // Reinicio manual
  const handleManualRetry = React.useCallback(() => {
    // if (isConnected) {
    setRetryCount(0);
    handleRetry();
    // } else {
    // }
  }, []);

  // Renderizar overlay de error
  const renderErrorOverlay = () => {
    if (!error || retryCount < maxRetries) return null;

    return (
      <View style={styles.errorOverlay}>
        <Text style={styles.errorText}>Error de reproducción</Text>
        <Text style={styles.errorDetail}>
          {!isConnected
            ? 'Sin conexión a internet'
            : 'No se pudo cargar el video'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleManualRetry}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderizar indicador de buffering/reconexión
  const renderLoadingOverlay = () => {
    if (error) {
      return (
        <View style={styles.loadingOverlayRetry}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleManualRetry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isBuffering) {
      return (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    return null;
  };

  const toggleFullscreen = () => {
    setFullscreen(prev => !prev);
    dispatch(setIsFullScreenVideoPlayer(!fullscreen));
  };

  return (
    <View style={styles.container}>
      <Video
        key={playerKey}
        ref={videoRef}
        source={{
          uri: videoUrl,
          type: 'm3u8',
        }}
        style={styles.video}
        paused={!isFocused}
        onLoad={onLoad}
        onProgress={onProgress}
        onBuffer={onBuffer}
        onError={onError}
        onEnd={() => console.log('Video terminado')}
        controls={false}
        resizeMode="contain"
        // Configuración de buffer para mejor recuperación
        bufferConfig={{
          minBufferMs: 15000,
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000,
        }}
        // Android: reintentos automáticos de ExoPlayer
        minLoadRetryCount={10}
        // Prevenir que se detenga en background
        playInBackground={false}
        playWhenInactive={true}
        ignoreSilentSwitch="ignore"
      />
      {
        <View
          style={{
            ...styles.fullscreenButton,
            ...{paddingBottom: fullscreen ? insets.bottom : 0},
          }}>
          <TouchableOpacity
            onPress={toggleFullscreen}
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: 10,
              borderRadius: 10,
            }}>
            {fullscreen ? (
              <Icon as={MinimizeIcon} color="$white" />
            ) : (
              <Icon as={MaximizeIcon} color="$white" />
            )}
          </TouchableOpacity>
        </View>
      }
      {renderLoadingOverlay()}
      {/* {renderErrorOverlay()} */}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: 10,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  loadingOverlayRetry: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,1)',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorDetail: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
  },
  retryButton: {
    borderColor: '#fff',
    borderWidth: 1,
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
